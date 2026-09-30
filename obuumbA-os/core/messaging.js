import crypto from "crypto";

export const DELIVERY_STATES=["DRAFT","QUEUED","SENT","DELIVERED","READ","FAILED"];

export function createMessage(input){
  if(!input?.recipient) throw new Error("recipient required");
  if(!input?.body) throw new Error("message body required");
  return {
    id:"msg-"+crypto.randomUUID(),
    channel:String(input.channel||"MANUAL").toUpperCase(),
    direction:input.direction||"OUTBOUND",
    recipient:String(input.recipient),
    bookingId:input.bookingId||null,
    providerActionId:input.providerActionId||null,
    body:String(input.body),
    status:"DRAFT",
    externalId:null,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };
}

export function transitionMessage(message,status,externalId=null){
  if(!DELIVERY_STATES.includes(status)) throw new Error("invalid delivery status");
  const allowed={
    DRAFT:["QUEUED","FAILED"],
    QUEUED:["SENT","FAILED"],
    SENT:["DELIVERED","FAILED"],
    DELIVERED:["READ","FAILED"],
    READ:[],
    FAILED:["QUEUED"]
  };
  if(status!==message.status && !(allowed[message.status]||[]).includes(status))
    throw new Error(`invalid message transition: ${message.status} -> ${status}`);
  return {...message,status,externalId:externalId??message.externalId,updatedAt:new Date().toISOString()};
}

export function buildProviderRequestMessage(action){
  return [
    "O'BUUMBA BOOKING REQUEST",
    `Booking: ${action.bookingId}`,
    `Service: ${action.message?.service||"Not specified"}`,
    `Customer: ${action.message?.customer?.name||"Not provided"}`,
    "Requirements:",
    JSON.stringify(action.message?.requirements||{})
  ].join("\n");
}
