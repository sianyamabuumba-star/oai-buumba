import express from "express";
import path from "path";
import fs from "fs/promises";
import {fileURLToPath} from "url";
import {JsonStore} from "./core/store.js";
import {auditEvent} from "./core/audit.js";
import {adapters,systemStatus} from "./core/adapters.js";
import {createTask,runTask,retryTask} from "./core/tasks.js";
import {classify,extractRequirements} from "./core/router.js";
import {matchProviders} from "./core/match.js";
import {simulateConcierge} from "./core/simulation.js";
import {nextRequestState} from "./core/request-flow.js";
import {validateProvider} from "./core/provider-onboarding.js";
import {createService,isAvailable} from "./core/services.js";

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
app.use(express.json({limit:"64kb"}));
app.use(express.static(__dirname));

const dataDir=path.join(__dirname,"data","runtime");
const requestStore=new JsonStore(path.join(dataDir,"requests.json"));
const taskStore=new JsonStore(path.join(dataDir,"tasks.json"));
const auditStore=new JsonStore(path.join(dataDir,"audit.json"));
const providerStore=new JsonStore(path.join(dataDir,"providers-runtime.json"));
const serviceStore=new JsonStore(path.join(dataDir,"services.json"));

async function audit(event){ return auditEvent(auditStore,event); }
async function providers(){
  try{return JSON.parse(await fs.readFile(path.join(__dirname,"data","providers.json"),"utf8"))}
  catch{return []}
}

app.get("/api/health",async(req,res)=>{
  res.json({ok:true,service:"O'BUUMBA OS",mode:"MVP+",persistence:"local-json",time:new Date().toISOString()});
});

app.get("/api/system/status",async(req,res)=>{
  res.json({service:"O'BUUMBA OS",persistence:"READY",adapters:systemStatus()});
});

app.post("/api/requests",async(req,res)=>{
  const message=String(req.body?.message||"").trim();
  if(!message)return res.status(400).json({error:"message required"});
  const intents=classify(message);
  const requirements=extractRequirements(message);
  const runtime=await providerStore.all();
  const base=await providers();
  const registry=[...base,...runtime];
  const matched=await matchProviders(registry,intents,requirements).catch(()=>[]);
  const r={
    id:crypto.randomUUID(),message,intents,
    requirements,
    matches:matched.map(p=>({providerId:p.id||null,name:p.name,category:p.category,verified:true,matchScore:p.matchScore})),
    status:matched.length?"MATCHING":"NEEDS_HUMAN",createdAt:new Date().toISOString()
  };
  await requestStore.insert(r);
  await audit({type:"request.created",requestId:r.id,intents});
  const task=await createTask(taskStore,{
    domain:"concierge",goal:`Route request ${r.id}`,
    inputs:{requestId:r.id,message,intents},
    actions:[{adapter:"local",action:"classify_request",payload:{requestId:r.id,intents}}]
  });
  await runTask(taskStore,audit,adapters,task);
  res.status(201).json({...r,taskId:task.id});
});

app.get("/api/requests",async(req,res)=>res.json(await requestStore.all()));
app.get("/api/providers",async(req,res)=>res.json([...await providers(),...await providerStore.all()]));
app.get("/api/services",async(req,res)=>res.json(await serviceStore.all()));
app.post("/api/services",async(req,res)=>{try{const service=createService(req.body);const provider=[...await providers(),...await providerStore.all()].find(p=>p.id===service.providerId);if(!provider)return res.status(404).json({error:"provider not found"});await serviceStore.insert(service);await audit({type:"service.created",serviceId:service.id,providerId:service.providerId});res.status(201).json(service)}catch(e){res.status(400).json({error:e.message})}});
app.post("/api/services/:id/check-availability",async(req,res)=>{const service=(await serviceStore.all()).find(x=>x.id===req.params.id);if(!service)return res.status(404).json({error:"service not found"});const result=isAvailable(service,req.body?.when);await audit({type:"availability.checked",serviceId:service.id,status:result.status});res.json({...result,serviceId:service.id,mode:service.availability.mode})});

app.post("/api/providers",async(req,res)=>{
  try{
    const provider=validateProvider(req.body);
    const existing=await providerStore.all();
    if(existing.some(p=>p.id===provider.id)) return res.status(409).json({error:"provider id already exists"});
    await providerStore.insert(provider);
    await audit({type:"provider.created",providerId:provider.id,verification:provider.verification.status});
    res.status(201).json(provider);
  }catch(e){res.status(400).json({error:e.message})}
});

app.patch("/api/providers/:id/verification",async(req,res)=>{
  const items=await providerStore.all();
  const current=items.find(p=>p.id===req.params.id);
  if(!current)return res.status(404).json({error:"provider not found"});
  try{
    const next=validateProvider({...current,verification:req.body.verification});
    const updated=await providerStore.update(current.id,{verified:next.verified,verification:next.verification});
    await audit({type:"provider.verification.updated",providerId:current.id,status:next.verification.status});
    res.json(updated);
  }catch(e){res.status(400).json({error:e.message})}
});

app.post("/api/simulate",async(req,res)=>{
  const message=String(req.body?.message||"").trim();
  if(!message)return res.status(400).json({error:"message required"});
  const result=await simulateConcierge(message,new URL("./data/providers.json",import.meta.url));
  await audit({type:"simulation.completed",simulationId:result.simulationId,intents:result.intents,externalSideEffects:false});
  res.status(200).json(result);
});

app.patch("/api/requests/:id",async(req,res)=>{
  const current=(await requestStore.all()).find(x=>x.id===req.params.id);
  if(!current)return res.status(404).json({error:"not found"});
  const allowed=["NEW","MATCHING","AWAITING_CONFIRMATION","CONFIRMED","IN_PROGRESS","COMPLETED","NEEDS_HUMAN","CANCELLED","FAILED"];
  if(req.body.status && !allowed.includes(req.body.status))return res.status(400).json({error:"invalid status"});
  let nextStatus=req.body.status||current.status;
  if(req.body.action){
    if(req.body.action==="confirm" && req.body.approval!==true)
      return res.status(400).json({error:"explicit approval required"});
    try{nextStatus=nextRequestState(current,req.body.action);}
    catch(e){return res.status(409).json({error:e.message});}
  }
  const patch={status:nextStatus};
  if(req.body.action==="confirm"){
    patch.ownerApprovedAt=new Date().toISOString();
    patch.confirmationMode="OWNER_APPROVAL";
    patch.externalConfirmation="NOT_VERIFIED";
  }
  const updated=await requestStore.update(req.params.id,patch);
  await audit({type:"request.updated",requestId:updated.id,status:updated.status});
  res.json(updated);
});

app.post("/api/tasks",async(req,res)=>{
  try{
    const task=await createTask(taskStore,req.body||{});
    await audit({type:"task.created",taskId:task.id,domain:task.domain});
    res.status(201).json(task);
  }catch(e){res.status(400).json({error:e.message})}
});

app.get("/api/tasks",async(req,res)=>res.json(await taskStore.all()));

app.get("/api/tasks/:id",async(req,res)=>{
  const task=(await taskStore.all()).find(x=>x.id===req.params.id);
  task?res.json(task):res.status(404).json({error:"not found"});
});

app.post("/api/tasks/:id/retry",async(req,res)=>{
  const task=(await taskStore.all()).find(x=>x.id===req.params.id);
  if(!task)return res.status(404).json({error:"not found"});
  try{res.json(await retryTask(taskStore,audit,adapters,task));}catch(e){res.status(400).json({error:e.message})}
});

app.post("/api/tasks/:id/run",async(req,res)=>{
  const task=(await taskStore.all()).find(x=>x.id===req.params.id);
  if(!task)return res.status(404).json({error:"not found"});
  res.json(await runTask(taskStore,audit,adapters,task));
});

app.post("/api/tasks/:id/verify",async(req,res)=>{
  const task=(await taskStore.all()).find(x=>x.id===req.params.id);
  if(!task)return res.status(404).json({error:"not found"});
  const verified=task.status==="DONE" && Array.isArray(task.outputs);
  await audit({type:"task.verified",taskId:task.id,verified});
  res.json({taskId:task.id,verified,rule:"DONE + recorded outputs"});
});

app.get("/api/audit",async(req,res)=>res.json((await auditStore.all()).slice(0,100)));

app.listen(process.env.PORT||3000,()=>console.log("O'BUUMBA OS running"));
