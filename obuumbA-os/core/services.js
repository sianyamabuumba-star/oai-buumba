import crypto from "crypto";
const days=["sun","mon","tue","wed","thu","fri","sat"];

export function createService(input){
  if(!String(input?.name||"").trim()) throw new Error("service name required");
  if(!String(input?.providerId||"").trim()) throw new Error("providerId required");
  return {id:String(input.id||("service-"+crypto.randomUUID())),providerId:String(input.providerId),name:String(input.name).trim(),description:String(input.description||""),tags:Array.isArray(input.tags)?input.tags:[],durationMinutes:Number(input.durationMinutes||0)||null,maxPartySize:Number(input.maxPartySize||0)||null,availability:input.availability||{mode:"ON_REQUEST",rules:[]}};
}

function resolveDate(hint,reference=new Date()){
  const h=String(hint||"").toLowerCase();
  const d=new Date(reference);
  if(h==="today"||h==="tonight") return d;
  if(h==="tomorrow"){d.setDate(d.getDate()+1);return d;}
  const target=days.indexOf(h.slice(0,3));
  if(target>=0){const delta=(target-d.getDay()+7)%7;d.setDate(d.getDate()+(delta||7));return d;}
  return null;
}

function parseTime(hint){
  const m=String(hint||"").toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if(!m)return null;
  let hour=Number(m[1]); const minute=Number(m[2]||0);
  if(m[3]==="pm"&&hour<12)hour+=12; if(m[3]==="am"&&hour===12)hour=0;
  return {hour,minute};
}

export function isAvailable(service,when){
  if(!service?.availability || service.availability.mode==="ON_REQUEST") return {status:"UNKNOWN",reason:"Provider confirmation required."};
  const d=new Date(when);
  if(Number.isNaN(d.getTime())) return {status:"UNKNOWN",reason:"Invalid date/time."};
  const day=days[d.getDay()],rule=(service.availability.rules||[]).find(r=>r.day===day);
  if(!rule)return {status:"UNAVAILABLE",reason:"No availability rule for this day."};
  const mins=d.getHours()*60+d.getMinutes();
  const [sh,sm]=String(rule.start||"00:00").split(":").map(Number),[eh,em]=String(rule.end||"23:59").split(":").map(Number);
  const start=sh*60+sm,end=eh*60+em;
  return {status:mins>=start&&mins<=end?"AVAILABLE":"UNAVAILABLE",reason:mins>=start&&mins<=end?"Within configured window.":"Outside configured window."};
}

export function checkRequirements(service,requirements,reference=new Date()){
  const timeHint=requirements?.timeHints?.[0], dateHint=requirements?.dateHints?.[0];
  if(!timeHint||!dateHint)return {status:"UNKNOWN",reason:"A specific date and time are required for configured availability checking."};
  const date=resolveDate(dateHint,reference), time=parseTime(timeHint);
  if(!date||!time)return {status:"UNKNOWN",reason:"Could not resolve requested date/time."};
  date.setHours(time.hour,time.minute,0,0);
  const slot=isAvailable(service,date);
  if(slot.status==="UNAVAILABLE")return slot;
  if(requirements.partySize && service.maxPartySize && requirements.partySize>service.maxPartySize)
    return {status:"UNAVAILABLE",reason:"Requested party size exceeds configured service capacity."};
  return {...slot,requestedAt:date.toISOString()};
}
