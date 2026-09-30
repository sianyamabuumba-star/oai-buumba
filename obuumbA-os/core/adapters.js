const blocked=(name,reason)=>({
  name,status:"BLOCKED",health:()=>({name,status:"BLOCKED",reason}),
  capabilities:()=>[],execute:async()=>({status:"BLOCKED",reason}),
  verify:async(result)=>result,rollback:async()=>({status:"NOT_SUPPORTED"})
});

export const adapters = {
  local: {
    name:"local", status:"READY",
    health:()=>({name:"local",status:"READY"}),
    capabilities:()=>["create_task","classify_request","audit","persist"],
    execute:async(action,payload)=>({status:"DONE",action,payload}),
    verify:async(result)=>({verified:true,result}),
    rollback:async()=>({status:"DONE"})
  },
  github: blocked("github","Use the connected GitHub integration for repository actions; credentials are not stored in the app."),
  notion: blocked("notion","Connect/authorize Notion before live execution."),
  todo: blocked("todo","Connect/authorize task service before live execution."),
  whatsapp: blocked("whatsapp","WhatsApp Business credentials/webhook are not connected."),
  database: blocked("database","Managed production database is not connected; local JSON persistence is active."),
  payments: blocked("payments","Payment provider is not connected."),
  maps: blocked("maps","Maps/routing provider is not connected."),
  notifications: blocked("notifications","Notification provider is not connected.")
};
export function systemStatus(){
  return Object.values(adapters).map(a=>a.health());
}
