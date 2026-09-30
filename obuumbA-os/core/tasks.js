import crypto from "crypto";
export const TASK_STATES=["NEW","PLANNED","READY","RUNNING","BLOCKED","DONE","FAILED","NEEDS_OWNER"];
export async function createTask(store,input){
  const task={id:crypto.randomUUID(),domain:input.domain||"operations",goal:String(input.goal||"").trim(),inputs:input.inputs||{},status:"NEW",actions:input.actions||[],outputs:[],dependencies:input.dependencies||[],requires_owner:input.requires_owner||[],attempts:0,maxAttempts:Number.isInteger(input.maxAttempts)?Math.max(1,input.maxAttempts):1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  if(!task.goal) throw new Error("goal required");
  return store.insert(task);
}
export async function runTask(store,audit,registry,task){
  if(!task) throw new Error("task not found");
  if(task.status==="DONE") return task;
  const attempts=(task.attempts||0)+1;
  await store.update(task.id,{status:"RUNNING",attempts});
  await audit({type:"task.started",taskId:task.id,attempt:attempts});
  const results=[];
  try{
    for(const action of task.actions.length?task.actions:[{adapter:"local",action:"create_task",payload:{goal:task.goal}}]){
      const adapter=registry[action.adapter]||registry.local;
      const result=await adapter.execute(action.action,action.payload||task.inputs);
      results.push({adapter:adapter.name,action:action.action,status:result.status,result});
      await audit({type:"adapter.executed",taskId:task.id,adapter:adapter.name,action:action.action,status:result.status});
      if(result.status==="BLOCKED"){
        const terminal=attempts>=task.maxAttempts, next=terminal?"NEEDS_OWNER":"READY";
        await store.update(task.id,{status:next,outputs:results,requires_owner:terminal?[result.reason]:[]});
        await audit({type:"task.blocked",taskId:task.id,reason:result.reason,retryable:!terminal});
        return {...task,status:next,attempts,outputs:results,requires_owner:terminal?[result.reason]:[]};
      }
      if(result.status==="FAILED"){
        const terminal=attempts>=task.maxAttempts, next=terminal?"FAILED":"READY";
        await store.update(task.id,{status:next,outputs:results});
        await audit({type:"task.failed",taskId:task.id,retryable:!terminal});
        return {...task,status:next,attempts,outputs:results};
      }
    }
  }catch(error){
    const terminal=attempts>=task.maxAttempts, next=terminal?"FAILED":"READY";
    await store.update(task.id,{status:next,outputs:results,error:String(error.message||error)});
    await audit({type:"task.exception",taskId:task.id,error:String(error.message||error),retryable:!terminal});
    return {...task,status:next,attempts,outputs:results,error:String(error.message||error)};
  }
  await store.update(task.id,{status:"DONE",outputs:results});
  await audit({type:"task.completed",taskId:task.id,attempt:attempts});
  return {...task,status:"DONE",attempts,outputs:results};
}
export async function retryTask(store,audit,registry,task){
  if(!task) throw new Error("task not found");
  if(!["READY","FAILED","NEEDS_OWNER"].includes(task.status)) throw new Error("task is not retryable");
  return runTask(store,audit,registry,task);
}
