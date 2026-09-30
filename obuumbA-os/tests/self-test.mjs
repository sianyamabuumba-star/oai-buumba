import assert from "node:assert/strict";
import fs from "fs/promises";
import os from "os";
import path from "path";
import {JsonStore} from "../core/store.js";
import {createTask,runTask} from "../core/tasks.js";
import {adapters} from "../core/adapters.js";
import {classify,extractRequirements} from "../core/router.js";

const dir=await fs.mkdtemp(path.join(os.tmpdir(),"obuumba-"));
const taskStore=new JsonStore(path.join(dir,"tasks.json"));
const auditStore=new JsonStore(path.join(dir,"audit.json"));
const audit=event=>auditStore.insert(event);

assert.deepEqual(classify("I need an airport pickup"),["transport"]);
assert.ok(classify("help with my logo and website").includes("creative_design"));
assert.deepEqual(extractRequirements("pickup tomorrow at 7pm for K500").timeHints,["7pm"]);
const task=await createTask(taskStore,{domain:"concierge",goal:"Route airport pickup",actions:[{adapter:"local",action:"classify_request",payload:{message:"airport pickup"}}]});
const done=await runTask(taskStore,audit,adapters,task);
assert.equal(done.status,"DONE");
const blocked=await createTask(taskStore,{domain:"concierge",goal:"Send WhatsApp confirmation",actions:[{adapter:"whatsapp",action:"send",payload:{text:"test"}}]});
const stopped=await runTask(taskStore,audit,adapters,blocked);
assert.equal(stopped.status,"NEEDS_OWNER");
assert.equal((await taskStore.all()).length,2);
assert.ok((await auditStore.all()).length>=4);
console.log("O'BUUMBA OS self-test: PASS");
