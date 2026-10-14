import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import net from "node:net";
import path from "node:path";
import {fileURLToPath} from "node:url";

const appDir=path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function freePort(){
  const server=net.createServer();
  await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
  const {port}=server.address();
  await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
  return port;
}

async function startServer({token}={}){
  const port=await freePort();
  const env={...process.env,NODE_ENV:"production",HOST:"127.0.0.1",PORT:String(port)};
  if(token) env.ADMIN_API_TOKEN=token; else delete env.ADMIN_API_TOKEN;
  const child=spawn(process.execPath,["server.js"],{cwd:appDir,env,stdio:"ignore"});
  const baseUrl=`http://127.0.0.1:${port}`;
  try{
    let ready=false;
    for(let i=0;i<50;i++){
      if(child.exitCode!==null) throw new Error(`server exited with code ${child.exitCode}`);
      try{
        const response=await fetch(`${baseUrl}/api/health`);
        if(response.ok){ready=true;break}
      }catch{}
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert.equal(ready,true,"server should start and expose public health route");
    return {child,baseUrl};
  }catch(error){
    child.kill("SIGTERM");
    throw error;
  }
}

let running;
try{
  running=await startServer({token:"test-admin-token"});
  const health=await fetch(`${running.baseUrl}/api/health`);
  assert.equal(health.status,200,"health check remains public");
  const denied=await fetch(`${running.baseUrl}/api/not-a-real-route`);
  assert.equal(denied.status,401,"protected API rejects missing token");
  const wrong=await fetch(`${running.baseUrl}/api/not-a-real-route`,{headers:{Authorization:"Bearer wrong-token"}});
  assert.equal(wrong.status,401,"protected API rejects wrong token");
  const accepted=await fetch(`${running.baseUrl}/api/not-a-real-route`,{headers:{Authorization:"Bearer test-admin-token"}});
  assert.equal(accepted.status,404,"valid token passes authorization middleware");
}finally{
  if(running?.child && running.child.exitCode===null) running.child.kill("SIGTERM");
}

running=undefined;
try{
  running=await startServer();
  const blocked=await fetch(`${running.baseUrl}/api/not-a-real-route`);
  assert.equal(blocked.status,503,"production disables protected API when token is missing");
}finally{
  if(running?.child && running.child.exitCode===null) running.child.kill("SIGTERM");
}

console.log("O'BUUMBA OS HTTP security tests: PASS");
