import crypto from "node:crypto";

export const SOURCE_KINDS = Object.freeze(["URL", "TEXT", "FILE"]);
export const SOURCE_STATUSES = Object.freeze([
  "CAPTURED", "QUEUED", "FETCHED", "EXTRACTED", "ANALYSED", "BLOCKED", "FAILED"
]);

const transitions = Object.freeze({
  CAPTURED: ["QUEUED", "BLOCKED", "FAILED"],
  QUEUED: ["FETCHED", "EXTRACTED", "BLOCKED", "FAILED"],
  FETCHED: ["EXTRACTED", "BLOCKED", "FAILED"],
  EXTRACTED: ["ANALYSED", "BLOCKED", "FAILED"],
  ANALYSED: ["QUEUED", "BLOCKED"],
  BLOCKED: ["QUEUED"],
  FAILED: ["QUEUED"]
});

function boundedString(value, field, max, required = false) {
  if (value == null && !required) return "";
  if (typeof value !== "string") throw new TypeError(`${field} must be a string`);
  const result = value.trim();
  if (required && !result) throw new TypeError(`${field} is required`);
  if (result.length > max) throw new RangeError(`${field} exceeds ${max} characters`);
  return result;
}

export function normalizeSourceUrl(value) {
  const raw = boundedString(value, "url", 2048, true);
  let parsed;
  try { parsed = new URL(raw); }
  catch { throw new TypeError("url must be a valid absolute URL"); }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new TypeError("only HTTP and HTTPS source URLs are supported");
  }
  if (parsed.username || parsed.password) {
    throw new TypeError("source URLs must not contain embedded credentials");
  }
  if (!parsed.hostname) throw new TypeError("source URL must include a hostname");
  return parsed.toString();
}

export function createSourceRecord(input = {}, now = new Date()) {
  const ownerId = boundedString(input.ownerId, "ownerId", 128, true);
  const kind = boundedString(input.kind, "kind", 16, true).toUpperCase();
  if (!SOURCE_KINDS.includes(kind)) throw new TypeError("kind must be URL, TEXT or FILE");

  const url = kind === "URL" ? normalizeSourceUrl(input.url) : null;
  if (kind !== "URL" && input.url != null && String(input.url).trim()) {
    throw new TypeError("url is only valid for URL sources");
  }

  const title = boundedString(input.title, "title", 200);
  const notes = boundedString(input.notes, "notes", 5000);
  const timestamp = new Date(now).toISOString();

  return {
    id: crypto.randomUUID(),
    ownerId,
    kind,
    originalUrl: url,
    title,
    notes,
    status: "CAPTURED",
    contentHash: null,
    contentRef: null,
    sourceType: null,
    retrievedAt: null,
    parserVersion: null,
    analysisRef: null,
    errorCode: null,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function canTransitionSource(from, to) {
  return Boolean(transitions[from]?.includes(to));
}

export function transitionSource(record, nextStatus, details = {}, now = new Date()) {
  if (!record || typeof record !== "object") throw new TypeError("source record is required");
  if (!SOURCE_STATUSES.includes(nextStatus)) throw new TypeError("unknown source status");
  if (!canTransitionSource(record.status, nextStatus)) {
    throw new Error(`invalid source transition: ${record.status} -> ${nextStatus}`);
  }

  const allowedDetails = new Set([
    "contentHash", "contentRef", "sourceType", "retrievedAt",
    "parserVersion", "analysisRef", "errorCode"
  ]);
  for (const key of Object.keys(details)) {
    if (!allowedDetails.has(key)) throw new TypeError(`source detail is not writable: ${key}`);
  }

  const next = { ...record, ...details, status: nextStatus, updatedAt: new Date(now).toISOString() };
  next.id = record.id;
  next.ownerId = record.ownerId;
  next.kind = record.kind;
  next.originalUrl = record.originalUrl;
  next.createdAt = record.createdAt;
  return next;
}
