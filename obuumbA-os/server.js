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

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
app.use(express.json({limit:"64kb"}));
app.use(express.static(__dirname));

const dataDir=path.join(__dirname,"data","runtime");
const requestStore=new JsonStore(path.join(dataDir,"requests.json"));
const taskStore=new JsonStore(path.join(dataDir,"tasks.json"));
const auditStore=new JsonStore(path.join(dataDir,"audit.json"));

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
  const matched=await matchProviders(new URL("./data/providers.json",import.meta.url),intents,requirements).catch(()=>[]);
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
app.get("/api/providers",async(req,res)=>res.json(await providers()));

app.patch("/api/requests/:id",async(req,res)=>{
  const current=(await requestStore.all()).find(x=>x.id===req.params.id);
  if(!current)return res.status(404).json({error:"not found"});
  const allowed=["NEW","MATCHING","AWAITING_CONFIRMATION","CONFIRMED","IN_PROGRESS","COMPLETED","NEEDS_HUMAN","CANCELLED","FAILED"];
  if(req.body.status && !allowed.includes(req.body.status))return res.status(400).json({error:"invalid status"});
  const updated=await requestStore.update(req.params.id,{status:req.body.status||current.status});
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
