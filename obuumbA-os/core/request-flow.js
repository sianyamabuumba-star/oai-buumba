const transitions={
  NEW:["MATCHING","NEEDS_HUMAN","CANCELLED"],
  MATCHING:["AWAITING_CONFIRMATION","NEEDS_HUMAN","CANCELLED"],
  AWAITING_CONFIRMATION:["CONFIRMED","CANCELLED","NEEDS_HUMAN"],
  CONFIRMED:["IN_PROGRESS","CANCELLED","FAILED"],
  IN_PROGRESS:["COMPLETED","FAILED","NEEDS_HUMAN"],
  COMPLETED:[],
  NEEDS_HUMAN:["MATCHING","AWAITING_CONFIRMATION","CANCELLED","FAILED"],
  CANCELLED:[],
  FAILED:["NEEDS_HUMAN","CANCELLED"]
};
export function canTransition(from,to){ return from===to || (transitions[from]||[]).includes(to); }
export function nextRequestState(request,action){
  const map={match:"AWAITING_CONFIRMATION",confirm:"CONFIRMED",start:"IN_PROGRESS",complete:"COMPLETED",cancel:"CANCELLED",escalate:"NEEDS_HUMAN"};
  const to=map[action];
  if(!to) throw new Error("unknown action");
  if(!canTransition(request.status,to)) throw new Error(`invalid transition: ${request.status} -> ${to}`);
  return to;
}
