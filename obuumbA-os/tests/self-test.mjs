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
assert.deepEqual(classify("I need AI help with my website"),["tech_help"]);
assert.ok(classify("help with my logo and website").includes("creative_design"));
const req=extractRequirements("pickup tomorrow at 7pm in Livingstone for 4 guests under K500");
assert.deepEqual(req.timeHints,["7pm"]);
assert.deepEqual(req.dateHints,["tomorrow"]);
assert.equal(req.location,"Livingstone");
assert.equal(req.partySize,4);
assert.deepEqual(req.budgetHints,["K500"]);

const task=await createTask(taskStore,{domain:"concierge",goal:"Route airport pickup",actions:[{adapter:"local",action:"classify_request",payload:{message:"airport pickup"}}]});
const done=await runTask(taskStore,audit,adapters,task);
assert.equal(done.status,"DONE");
const blocked=await createTask(taskStore,{domain:"concierge",goal:"Send WhatsApp confirmation",actions:[{adapter:"whatsapp",action:"send",payload:{text:"test"}}]});
const stopped=await runTask(taskStore,audit,adapters,blocked);
assert.equal(stopped.status,"NEEDS_OWNER");
assert.equal((await taskStore.all()).length,2);
assert.ok((await auditStore.all()).length>=4);
console.log("O'BUUMBA OS self-test: PASS");
