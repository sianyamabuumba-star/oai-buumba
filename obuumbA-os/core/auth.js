import { timingSafeEqual } from "node:crypto";

export function hasValidAdminToken(authorizationHeader, expectedToken) {
  if (typeof expectedToken !== "string" || expectedToken.length === 0) return false;
  const match = String(authorizationHeader || "").match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const provided = Buffer.from(match[1], "utf8");
  const expected = Buffer.from(expectedToken, "utf8");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
