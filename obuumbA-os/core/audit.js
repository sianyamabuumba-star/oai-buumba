import crypto from "crypto";
export function auditEvent(store, event) {
  return store.insert({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...event
  });
}
