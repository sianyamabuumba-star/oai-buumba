import crypto from "crypto";

export const PROVIDER_ACTION_STATES=["NOT_SENT","PENDING","ACCEPTED","DECLINED","EXPIRED","FAILED"];

export function createProviderAction(booking){
  if(!booking?.id) throw new Error("booking required");
  return {
    id:"provider-action-"+crypto.randomUUID(),
    bookingId:booking.id,
    providerId:booking.providerId,
    serviceId:booking.serviceId,
    status:"NOT_SENT",
    channel:"MANUAL",
    message:{
      type:"BOOKING_REQUEST",
      bookingId:booking.id,
      service:booking.serviceSnapshot?.name||null,
      customer:booking.customer||null,
      requirements:booking.requestSnapshot?.requirements||null
    },
    providerResponse:null,
    externalId:null,
    sentAt:null,
    respondedAt:null,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };
}

export function updateProviderAction(action,status,input={}){
  if(!PROVIDER_ACTION_STATES.includes(status)) throw new Error("invalid provider action status");
  const allowed={
    NOT_SENT:["PENDING","FAILED"],
    PENDING:["ACCEPTED","DECLINED","EXPIRED","FAILED"],
    ACCEPTED:[],
    DECLINED:[],
    EXPIRED:["PENDING"],
    FAILED:["PENDING"]
  };
  if(status!==action.status && !(allowed[action.status]||[]).includes(status))
    throw new Error(`invalid provider action transition: ${action.status} -> ${status}`);
  return {
    ...action,status,
    providerResponse:input.response??action.providerResponse,
    externalId:input.externalId??action.externalId,
    sentAt:status==="PENDING"&&!action.sentAt?new Date().toISOString():action.sentAt,
    respondedAt:["ACCEPTED","DECLINED","EXPIRED","FAILED"].includes(status)?new Date().toISOString():action.respondedAt,
    updatedAt:new Date().toISOString()
  };
}
