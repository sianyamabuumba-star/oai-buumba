export async function matchProviders(providerFile,intents){
  const providers=await import(providerFile,{with:{type:"json"}});
  const list=providers.default||providers;
  return list.filter(p=>p.verified===true && intents.some(i=>String(p.category).toLowerCase().includes(i.replace("_"," "))));
}
