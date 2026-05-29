const SESSION_VERSION = "1";
const SESSION_HOURS = 8;

function getSessionSecret(): string {
  const secret =
    process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set");
  }
  return secret;
}

async function signPayload(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return Buffer.from(signature).toString("base64url");
}

/** Signed admin session — not a raw user id (prevents cookie tampering). */
export async function createAdminSessionToken(userId: string): Promise<string> {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${SESSION_VERSION}:${userId}:${exp}`;
  return `${payload}.${await signPayload(payload)}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<{ userId: string } | null> {
  if (!token) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!payload || !signature) return null;

  let expected: string;
  try {
    expected = await signPayload(payload);
  } catch {
    return null;
  }

  if (signature.length !== expected.length) return null;
  let valid = true;
  for (let i = 0; i < signature.length; i++) {
    if (signature.charCodeAt(i) !== expected.charCodeAt(i)) valid = false;
  }
  if (!valid) return null;

  const [version, userId, expStr] = payload.split(":");
  if (version !== SESSION_VERSION || !userId || !expStr) return null;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;

  return { userId };
}
