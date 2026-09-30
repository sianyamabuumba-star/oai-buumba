import crypto from "crypto";

const allowed=["Accommodation","Transport","Tour / Activity","Food","Shopping","Creative / Design","Tech Help","Business","Other"];
const verificationStatuses=["UNVERIFIED","PENDING","VERIFIED","SUSPENDED"];

export function validateProvider(input){
  const p=input||{};
  if(!String(p.name||"").trim()) throw new Error("name required");
  if(!allowed.includes(p.category)) throw new Error("unsupported category");
  const status=p.verification?.status||"PENDING";
  if(!verificationStatuses.includes(status)) throw new Error("invalid verification status");
  return {
    id:String(p.id||("provider-"+crypto.randomUUID())),
    name:String(p.name).trim(),
    category:p.category,
    verified:status==="VERIFIED",
    verification:{status,verifiedAt:p.verification?.verifiedAt||null,method:p.verification?.method||null},
    phone:p.phone||null,location:p.location||null,tags:Array.isArray(p.tags)?p.tags:[],
    service_ids:Array.isArray(p.service_ids)?p.service_ids:[]
  };
}
