import crypto from "crypto";
const days=["sun","mon","tue","wed","thu","fri","sat"];

export function createService(input){
  if(!String(input?.name||"").trim()) throw new Error("service name required");
  if(!String(input?.providerId||"").trim()) throw new Error("providerId required");
  return {id:String(input.id||("service-"+crypto.randomUUID())),providerId:String(input.providerId),name:String(input.name).trim(),description:String(input.description||""),tags:Array.isArray(input.tags)?input.tags:[],durationMinutes:Number(input.durationMinutes||0)||null,availability:input.availability||{mode:"ON_REQUEST",rules:[]}};
}
export function isAvailable(service,when){
  if(!service?.availability || service.availability.mode==="ON_REQUEST") return {status:"UNKNOWN",reason:"Provider confirmation required."};
  const d=new Date(when);
  if(Number.isNaN(d.getTime())) return {status:"UNKNOWN",reason:"Invalid date/time."};
  const day=days[d.getDay()];
  const rule=(service.availability.rules||[]).find(r=>r.day===day);
  if(!rule) return {status:"UNAVAILABLE",reason:"No availability rule for this day."};
  const mins=d.getHours()*60+d.getMinutes();
  const [sh,sm]=String(rule.start||"00:00").split(":").map(Number);
  const [eh,em]=String(rule.end||"23:59").split(":").map(Number);
  const start=sh*60+sm,end=eh*60+em;
  return {status:mins>=start&&mins<=end?"AVAILABLE":"UNAVAILABLE",reason:mins>=start&&mins<=end?"Within configured window.":"Outside configured window."};
}
