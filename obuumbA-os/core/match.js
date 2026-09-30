const normalize=(v)=>String(v||"").toLowerCase().replace(/[_-]+/g," ").trim();
const tokens=v=>normalize(v).split(/\s+/).filter(Boolean);

function overlap(a,b){const bs=new Set(tokens(b));return tokens(a).filter(x=>bs.has(x)).length;}

function scoreService(service,intents,requirements={}){
  const intentText=intents.join(" ");
  const tagScore=(service.tags||[]).reduce((n,t)=>n+overlap(t,intentText),0)*15;
  const nameScore=overlap(service.name,intentText)*20;
  const locationScore=requirements.location&&String(service.location||"").toLowerCase().includes(String(requirements.location).toLowerCase())?20:0;
  return tagScore+nameScore+locationScore;
}

function scoreProvider(provider,intents,requirements={}){
  const wanted=new Set(intents.map(normalize));
  const category=normalize(provider.category);
  const tags=Array.isArray(provider.tags)?provider.tags.map(normalize):[];
  let score=0;
  if(wanted.has(category)) score+=100;
  if(tags.some(t=>wanted.has(t))) score+=60;
  if(provider.verified===true && provider.verification?.status==="VERIFIED") score+=25;
  if(requirements.location && String(provider.location||"").toLowerCase().includes(String(requirements.location).toLowerCase())) score+=20;
  return score;
}

export async function matchProviders(providerSource,intents,requirements={},services=[]){
  const list=Array.isArray(providerSource)?providerSource:(await import(providerSource,{with:{type:"json"}})).default;
  return list.filter(p=>p.verified===true && p.verification?.status==="VERIFIED").map(p=>{
    const providerServices=services.filter(s=>s.providerId===p.id);
    const rankedServices=providerServices.map(s=>({...s,serviceScore:scoreService(s,intents,requirements)})).filter(s=>s.serviceScore>0).sort((a,b)=>b.serviceScore-a.serviceScore);
    const matchScore=scoreProvider(p,intents,requirements)+(rankedServices[0]?.serviceScore||0);
    return {...p,matchScore,matchedServices:rankedServices};
  }).filter(p=>p.matchScore>25).sort((a,b)=>b.matchScore-a.matchScore);
}
