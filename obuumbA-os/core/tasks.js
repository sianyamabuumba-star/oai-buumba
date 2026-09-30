import crypto from "crypto";
export const TASK_STATES=["NEW","PLANNED","READY","RUNNING","BLOCKED","DONE","FAILED","NEEDS_OWNER"];
export async function createTask(store, input) {
  const task={
    id:crypto.randomUUID(), domain:input.domain||"operations",
    goal:String(input.goal||"").trim(), inputs:input.inputs||{},
    status:"NEW", actions:input.actions||[], outputs:[],
    dependencies:input.dependencies||[], requires_owner:input.requires_owner||[],
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()
  };
  if(!task.goal) throw new Error("goal required");
  return store.insert(task);
}
export async function runTask(store,audit,registry,task) {
  if(!task) throw new Error("task not found");
  await store.update(task.id,{status:"RUNNING"});
  await audit({type:"task.started",taskId:task.id});
  const results=[];
  for(const action of task.actions.length?task.actions:[{adapter:"local",action:"create_task",payload:{goal:task.goal}}]){
    const adapter=registry[action.adapter]||registry.local;
    const result=await adapter.execute(action.action,action.payload||task.inputs);
    results.push({adapter:adapter.name,action:action.action,status:result.status,result});
    await audit({type:"adapter.executed",taskId:task.id,adapter:adapter.name,action:action.action,status:result.status});
    if(result.status==="BLOCKED"){
      await store.update(task.id,{status:"NEEDS_OWNER",outputs:results,requires_owner:[result.reason]});
      await audit({type:"task.blocked",taskId:task.id,reason:result.reason});
      return {...task,status:"NEEDS_OWNER",outputs:results,requires_owner:[result.reason]};
    }
  }
  await store.update(task.id,{status:"DONE",outputs:results});
  await audit({type:"task.completed",taskId:task.id});
  return {...task,status:"DONE",outputs:results};
}
