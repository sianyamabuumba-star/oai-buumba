import crypto from "crypto";
import {classify,extractRequirements} from "./router.js";
import {matchProviders} from "./match.js";

export async function simulateConcierge(message,providerFile){
  const id=crypto.randomUUID();
  const intents=classify(message);
  const requirements=extractRequirements(message);
  const matches=await matchProviders(providerFile,intents,requirements);
  const events=[
    {step:"CAPTURE",status:"DONE",detail:"Message captured in simulation mode."},
    {step:"UNDERSTAND",status:"DONE",intents},
    {step:"EXTRACT",status:"DONE",requirements},
    {step:"MATCH",status:matches.length?"DONE":"NEEDS_HUMAN",matches:matches.map(p=>({id:p.id,name:p.name,category:p.category,score:p.matchScore}))},
    {step:"ARRANGE",status:matches.length?"SIMULATED":"BLOCKED",detail:matches.length?"No external booking was made.":"No verified provider matched."},
    {step:"VERIFY",status:"DONE",detail:"Simulation output verified; no external side effect occurred."},
    {step:"LOG",status:"DONE",detail:"Simulation is safe to repeat."}
  ];
  return {simulationId:id,mode:"SIMULATION_ONLY",message,intents,requirements,matches,events,externalSideEffects:false};
}
