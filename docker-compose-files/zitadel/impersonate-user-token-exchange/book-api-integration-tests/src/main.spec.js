// @ts-check
// Obtain ACTOR token via JWT Profile (service account) → token exchange to impersonate admin/guest → call API

import { SignJWT, importPKCS8 } from "jose";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ISSUER = process.env.ZITADEL_ISSUER;
const API_URL = "http://localhost:8080/api";
const SHARED_DIR = process.env.SHARED_DIR || "/shared";
const bootstrap = JSON.parse(
  readFileSync(join(SHARED_DIR, "bootstrap.json"), "utf8"),
);
const projectId = bootstrap.projectId;
const scopes = bootstrap.scopes.join(" ");
const machine = bootstrap.machineUser;

// 1) JWT Profile: sign a client assertion with the machine JSON key
async function getActorAccessToken() {
  // "machine.key" is a JSON like:
  // { type:"serviceaccount", keyId:"...", key:"-----BEGIN PRIVATE KEY-----...", userId:"..." }
  const { keyId, key, userId } = machine.key;

  const pk = await importPKCS8(key, "RS256");
  const now = Math.floor(Date.now() / 1000);

  // aud must be the issuer base URL
  const assertion = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", kid: keyId })
    .setIssuedAt(now)
    .setExpirationTime(now + 60) // short lived
    .setIssuer(userId) // iss=sub=userId (service account)
    .setSubject(userId)
    .setAudience(ISSUER)
    .sign(pk);

  const body = new URLSearchParams();
  body.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.set("assertion", assertion);
  // Ask for audiences + roles to ease later introspection, though not strictly needed for actor
  body.set("scope", scopes);

  const res = await fetch(`${ISSUER}/oauth/v2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(
      `JWT Profile token failed: ${res.status} ${JSON.stringify(json)}`,
    );
  return json.access_token;
}

/**
 * 2) Token Exchange (Impersonation) to end up with a *user* token (as JWT)
 * @param {string} actorToken
 * @param {string} userId
 * @returns {Promise<string>}
 */
async function impersonate(actorToken, userId) {
  const body = new URLSearchParams();
  body.set("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
  body.set("actor_token", actorToken);
  body.set("subject_token_type", "urn:zitadel:params:oauth:token-type:user_id");
  body.set("subject_token", userId);
  body.set("requested_token_type", "urn:ietf:params:oauth:token-type:jwt"); // ask for JWT AT
  body.set("scope", scopes);

  const res = await fetch(`${ISSUER}/oauth/v2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(
      `token-exchange failed: ${res.status} ${JSON.stringify(json)}`,
    );
  return json.access_token;
}

/**
 *
 * @param {string} token
 * @param {string} method
 * @param {string} path
 * @param {any} [body]
 * @returns {Promise<{status: number, text: string}>}
 */
async function callApi(token, method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, text };
}

(async () => {
  const actor = await getActorAccessToken();

  // Impersonate admin → create book
  const adminToken = await impersonate(actor, bootstrap.adminUserId);
  let r = await callApi(adminToken, "POST", "/books", { title: "My Book" });
  console.log("admin create book:", r.status, r.text);

  // Impersonate guest → read book
  const guestToken = await impersonate(actor, bootstrap.guestUserId);
  r = await callApi(guestToken, "GET", "/books/book-123");
  console.log("guest read book:", r.status, r.text);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
