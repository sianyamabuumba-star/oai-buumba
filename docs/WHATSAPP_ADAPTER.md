# WhatsApp Adapter Contract

O'BUUMBA OS treats WhatsApp as an external adapter. The core system must remain usable without it.

## Environment variables

- WHATSAPP_VERIFY_TOKEN — webhook verification token
- WHATSAPP_APP_SECRET — Meta app secret used for X-Hub-Signature-256 verification
- WHATSAPP_PHONE_NUMBER_ID — sender phone-number ID
- WHATSAPP_ACCESS_TOKEN — credential for outbound API calls

No credentials belong in source control.

## Webhook

GET /webhooks/whatsapp performs Meta webhook challenge verification.

POST /webhooks/whatsapp:
1. Verify X-Hub-Signature-256.
2. Normalize the first inbound message.
3. Use the WhatsApp message ID as the external idempotency key.
4. Persist the inbound message.
5. Return HTTP 200 after safe persistence.

## Normalized inbound shape

{ id, channel, direction, sender, timestamp, type, text, raw }

## Normalized outbound shape

{ id, channel, direction, recipient, bookingId, providerActionId, body, status, externalId }

## Safety rules

- Never trust an unsigned webhook.
- Never duplicate an inbound message with the same external ID.
- Never claim a message was sent until the external API confirms it.
- Never claim a booking is confirmed from message delivery alone.
- Keep provider confirmation and payment as separate states.

## Current state

The webhook boundary and normalization contract are implemented. The real Meta/WhatsApp credentials and outbound API adapter remain unconnected.
