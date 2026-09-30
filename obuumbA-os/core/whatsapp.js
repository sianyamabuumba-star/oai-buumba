import crypto from "crypto";

export function verifyWebhookSignature(rawBody,signature,secret){
  if(!rawBody||!signature||!secret)return false;
  const expected="sha256="+crypto.createHmac("sha256",secret).update(rawBody).digest("hex");
  const a=Buffer.from(expected),b=Buffer.from(String(signature));
  return a.length===b.length&&crypto.timingSafeEqual(a,b);
}

export function normalizeInbound(payload){
  const value=payload?.entry?.[0]?.changes?.[0]?.value;
  const message=value?.messages?.[0];
  if(!message)return null;
  return {
    id:String(message.id||""),
    channel:"WHATSAPP",
    direction:"INBOUND",
    sender:String(message.from||""),
    timestamp:message.timestamp?new Date(Number(message.timestamp)*1000).toISOString():new Date().toISOString(),
    type:String(message.type||"unknown"),
    text:message.text?.body?String(message.text.body):null,
    raw:message
  };
}

export function buildOutboundPayload(message,phoneNumberId){
  if(!phoneNumberId)throw new Error("WhatsApp phone number ID required");
  if(!message?.recipient||!message?.body)throw new Error("recipient and body required");
  return {
    messaging_product:"whatsapp",
    recipient_type:"individual",
    to:message.recipient,
    type:"text",
    text:{preview_url:false,body:message.body}
  };
}

export function webhookChallenge(query,verifyToken){
  if(String(query?.hub_verify_token||"")!==String(verifyToken||""))return null;
  return query?.hub_challenge?String(query.hub_challenge):null;
}
