import express from "express";
import path from "path";
import {fileURLToPath} from "url";
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
app.use(express.json());
app.use(express.static(__dirname));
const requests=[];
const intents=[
 ["accommodation",/hotel|lodge|room|stay/],
 ["transport",/airport|taxi|pickup|ride|transport/],
 ["tour_activity",/tour|cruise|sunset|activity/],
 ["food",/food|restaurant|meal|eat/],
 ["shopping",/shop|buy|store/],
 ["creative_design",/logo|design|brand|poster/],
 ["tech_help",/phone|computer|tech|ai/]
];
function classify(message){
 const m=String(message||"").toLowerCase();
 const hits=intents.filter(([,re])=>re.test(m)).map(([x])=>x);
 return hits.length?hits:["other"];
}
app.get("/api/health",(req,res)=>res.json({ok:true,service:"O'BUUMBA OS",mode:"MVP"}));
app.post("/api/requests",(req,res)=>{
 const message=req.body?.message?.trim();
 if(!message)return res.status(400).json({error:"message required"});
 const r={id:crypto.randomUUID(),message,intents:classify(message),status:"NEW",createdAt:new Date().toISOString()};
 requests.unshift(r); res.status(201).json(r);
});
app.get("/api/requests",(req,res)=>res.json(requests));
app.patch("/api/requests/:id",(req,res)=>{
 const r=requests.find(x=>x.id===req.params.id);
 if(!r)return res.status(404).json({error:"not found"});
 if(req.body.status)r.status=req.body.status;
 res.json(r);
});
app.listen(process.env.PORT||3000,()=>console.log("O'BUUMBA OS running"));