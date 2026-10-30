import assert from "node:assert/strict";
import fs from "fs/promises";
import os from "os";
import path from "path";
import {JsonStore} from "../core/store.js";
import {createTask,runTask} from "../core/tasks.js";
import {adapters} from "../core/adapters.js";
import {classify,extractRequirements} from "../core/router.js";
import {simulateConcierge} from "../core/simulation.js";
import {canTransition} from "../core/request-flow.js";
import {validateProvider} from "../core/provider-onboarding.js";
import {createService,isAvailable} from "../core/services.js";
import {matchProviders} from "../core/match.js";
import {hasValidAdminToken} from "../core/auth.js";
import {validateBookingSelection} from "../core/bookings.js";
import {verifyWebhookSignature} from "../core/whatsapp.js";
import crypto from "node:crypto";
import {createSourceRecord,normalizeSourceUrl,canTransitionSource,transitionSource} from "../core/source-records.js";

const dir=await fs.mkdtemp(path.join(os.tmpdir(),"obuumba-"));

const webhookSecret="test-webhook-secret";
const exactWebhookBody='{ "object": "whatsapp_business_account", "entry": [] }';
const webhookSignature="sha256="+crypto.createHmac("sha256",webhookSecret).update(exactWebhookBody).digest("hex");
assert.equal(verifyWebhookSignature(exactWebhookBody,webhookSignature,webhookSecret),true);
assert.equal(verifyWebhookSignature(JSON.stringify(JSON.parse(exactWebhookBody)),webhookSignature,webhookSecret),false);
assert.equal(verifyWebhookSignature(exactWebhookBody,webhookSignature,"wrong-secret"),false);
assert.equal(verifyWebhookSignature(exactWebhookBody,null,webhookSecret),false);


assert.equal(hasValidAdminToken("Bearer test-token","test-token"),true);
assert.equal(hasValidAdminToken("Bearer wrong-token","test-token"),false);
assert.equal(hasValidAdminToken(undefined,"test-token"),false);
assert.equal(hasValidAdminToken("test-token","test-token"),false);
assert.equal(hasValidAdminToken("Bearer test-token",""),false);
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

const providerFile=new URL("../data/providers.json",import.meta.url);
const matches=await matchProviders(providerFile,["transport"],req);
assert.deepEqual(matches,[]);

const simulation=await simulateConcierge("airport pickup tomorrow at 7pm in Livingstone for 4 guests",new URL("../data/providers.json",import.meta.url));
assert.equal(simulation.mode,"SIMULATION_ONLY");
assert.equal(simulation.externalSideEffects,false);
assert.equal(simulation.events.at(-1).status,"DONE");

assert.equal(canTransition("MATCHING","AWAITING_CONFIRMATION"),true);
assert.equal(canTransition("COMPLETED","CONFIRMED"),false);

const provider=validateProvider({name:"Test Transfer",category:"Transport",verification:{status:"VERIFIED",method:"owner_check"},tags:["airport pickup"]});
assert.equal(provider.verified,true);
assert.equal(provider.verification.status,"VERIFIED");
assert.throws(()=>validateProvider({name:"Bad",category:"Transport",verification:{status:"UNKNOWN"}}));

const bookingRequest={id:"request-1"};
const verifiedProvider={id:"provider-1",verified:true,verification:{status:"VERIFIED"}};
const matchingService={id:"service-1",providerId:"provider-1"};
assert.equal(validateBookingSelection({request:bookingRequest,provider:verifiedProvider,service:matchingService}),true);
assert.throws(()=>validateBookingSelection({request:bookingRequest,provider:{...verifiedProvider,verified:false},service:matchingService}),/verified/);
assert.throws(()=>validateBookingSelection({request:bookingRequest,provider:verifiedProvider,service:{...matchingService,providerId:"provider-2"}}),/does not belong/);
assert.throws(()=>validateBookingSelection({request:bookingRequest,provider:verifiedProvider,service:null}),/service not found/);

const service=createService({providerId:provider.id,name:"Airport Pickup",tags:["transport","airport pickup"],availability:{mode:"SCHEDULED",rules:[{day:"wed",start:"06:00",end:"22:00"}]}});
assert.equal(service.providerId,provider.id);
assert.equal(isAvailable(service,"2026-09-30T19:00:00").status,"AVAILABLE");
assert.equal(isAvailable(service,"2026-10-01T19:00:00").status,"UNAVAILABLE");

const ranked=await (await import("../core/match.js")).matchProviders([provider],["transport"],{location:"Livingstone"},[service]);
assert.equal(ranked.length,1);
assert.equal(ranked[0].matchedServices[0].name,"Airport Pickup");

const task=await createTask(taskStore,{domain:"concierge",goal:"Route airport pickup",actions:[{adapter:"local",action:"classify_request",payload:{message:"airport pickup"}}]});
const done=await runTask(taskStore,audit,adapters,task);
assert.equal(done.status,"DONE");
const blocked=await createTask(taskStore,{domain:"concierge",goal:"Send WhatsApp confirmation",actions:[{adapter:"whatsapp",action:"send",payload:{text:"test"}}]});
const stopped=await runTask(taskStore,audit,adapters,blocked);
assert.equal(stopped.status,"NEEDS_OWNER");
assert.equal((await taskStore.all()).length,2);
assert.ok((await auditStore.all()).length>=4);

const source = createSourceRecord({
  ownerId:"owner-1",kind:"URL",url:"https://example.com/research#section",
  title:"Research source",notes:"Compare this with the O'BUUMBA plan"
},new Date("2026-10-30T12:00:00.000Z"));
assert.equal(source.status,"CAPTURED");
assert.equal(source.ownerId,"owner-1");
assert.equal(source.originalUrl,"https://example.com/research#section");
assert.equal(source.createdAt,"2026-10-30T12:00:00.000Z");
assert.equal(canTransitionSource("CAPTURED","QUEUED"),true);
assert.equal(canTransitionSource("CAPTURED","ANALYSED"),false);
assert.throws(()=>normalizeSourceUrl("file:///etc/passwd"),/HTTP and HTTPS/);
assert.throws(()=>normalizeSourceUrl("https://user:pass@example.com"),/embedded credentials/);
assert.throws(()=>createSourceRecord({ownerId:"owner-1",kind:"URL",url:"not a url"}));
assert.throws(()=>createSourceRecord({ownerId:"owner-1",kind:"TEXT",url:"https://example.com"}),/only valid for URL/);
const queuedSource=transitionSource(source,"QUEUED");
const fetchedSource=transitionSource(queuedSource,"FETCHED",{contentHash:"sha256:example",sourceType:"text/html"});
assert.equal(fetchedSource.status,"FETCHED");
assert.equal(fetchedSource.id,source.id);
assert.equal(fetchedSource.ownerId,source.ownerId);
assert.throws(()=>transitionSource(source,"ANALYSED"),/invalid source transition/);
assert.throws(()=>transitionSource(queuedSource,"FETCHED",{ownerId:"attacker"}),/not writable/);

console.log("O'BUUMBA OS self-test: PASS");
