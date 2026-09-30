import crypto from "crypto";

export const BOOKING_STATES=[
  "REQUESTED","AWAITING_OWNER_APPROVAL","OWNER_APPROVED",
  "AWAITING_PROVIDER","PROVIDER_CONFIRMED","PAYMENT_PENDING",
  "CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED","FAILED"
];

export function createBooking(input){
  if(!input?.requestId) throw new Error("requestId required");
  if(!input?.providerId) throw new Error("providerId required");
  if(!input?.serviceId) throw new Error("serviceId required");
  return {
    id:"booking-"+crypto.randomUUID(),
    requestId:String(input.requestId),
    providerId:String(input.providerId),
    serviceId:String(input.serviceId),
    customer:input.customer||null,
    requestSnapshot:input.requestSnapshot||null,
    providerSnapshot:input.providerSnapshot||null,
    serviceSnapshot:input.serviceSnapshot||null,
    status:"REQUESTED",
    ownerApprovedAt:null,
    providerConfirmation:{status:"NOT_REQUESTED",externalId:null,confirmedAt:null},
    payment:{status:"NOT_CONNECTED",externalId:null,paidAt:null},
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };
}

const transitions={
  REQUESTED:["AWAITING_OWNER_APPROVAL","CANCELLED"],
  AWAITING_OWNER_APPROVAL:["OWNER_APPROVED","CANCELLED"],
  OWNER_APPROVED:["AWAITING_PROVIDER","CANCELLED"],
  AWAITING_PROVIDER:["PROVIDER_CONFIRMED","CANCELLED","FAILED"],
  PROVIDER_CONFIRMED:["PAYMENT_PENDING","CONFIRMED","CANCELLED","FAILED"],
  PAYMENT_PENDING:["CONFIRMED","FAILED","CANCELLED"],
  CONFIRMED:["IN_PROGRESS","CANCELLED"],
  IN_PROGRESS:["COMPLETED","FAILED"],
  COMPLETED:[],
  CANCELLED:[],
  FAILED:["AWAITING_PROVIDER","CANCELLED"]
};

export function advanceBooking(booking,to,meta={}){
  if(!booking) throw new Error("booking not found");
  if(to!==booking.status && !(transitions[booking.status]||[]).includes(to))
    throw new Error(`invalid booking transition: ${booking.status} -> ${to}`);
  const patch={status:to,...meta,updatedAt:new Date().toISOString()};
  if(to==="OWNER_APPROVED") patch.ownerApprovedAt=patch.ownerApprovedAt||new Date().toISOString();
  if(to==="PROVIDER_CONFIRMED") patch.providerConfirmation={status:"CONFIRMED",externalId:meta.externalId||null,confirmedAt:new Date().toISOString()};
  return {...booking,...patch};
}
