const normalize=(v)=>String(v||"").toLowerCase().replace(/[_-]+/g," ").trim();

function scoreProvider(provider,intents,requirements={}){
  const wanted=new Set(intents.map(normalize));
  const category=normalize(provider.category);
  const tags=Array.isArray(provider.tags)?provider.tags.map(normalize):[];
  let score=0;
  if(wanted.has(category)) score+=100;
  if(tags.some(t=>wanted.has(t))) score+=60;
  if(provider.verified===true) score+=25;
  if(requirements.location && String(provider.location||"").toLowerCase().includes(String(requirements.location).toLowerCase())) score+=20;
  return score;
}

export async function matchProviders(providerFile,intents,requirements={}){
  const providers=await import(providerFile,{with:{type:"json"}});
  const list=providers.default||providers;
  return list
    .filter(p=>p.verified===true)
    .map(p=>({...p,matchScore:scoreProvider(p,intents,requirements)}))
    .filter(p=>p.matchScore>25)
    .sort((a,b)=>b.matchScore-a.matchScore);
}
