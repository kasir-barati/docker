// @ts-check

import { SignJWT, importPKCS8 } from "jose";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createPrivateKey } from "node:crypto";

// Zitadel's issuer URL (for JWT audience) must match ZITADEL_EXTERNALDOMAIN:TRAEFIK_EXPOSED_PORT
const ZITADEL_ISSUER = "http://localhost:8080";
// Internal URLs for making actual HTTP requests from within Docker network
const TOKEN_ENDPOINT = "http://traefik:80/oauth/v2/token";
const API_URL = "http://traefik:80/api";
const SHARED_DIR = "/zitadel-pat";
const CLIENT_DIR = `${SHARED_DIR}/client`;
const clientId = await readFile(join(CLIENT_DIR, "integration-test-book-app-id"), "utf-8");
const clientSecret = await readFile(join(CLIENT_DIR, "integration-test-book-app-secret"), "utf-8");
const projectId = await readFile(join(SHARED_DIR, "project-id"), "utf-8");
const guestUserId = await readFile(join(SHARED_DIR, "guest-user-id"), "utf-8");
const adminUserId = await readFile(join(SHARED_DIR, "admin-user-id"), "utf-8");
/**
 * @type {{creationDate: string, keyId: string, keyContent: string}}
 * @example
 * ```json
 * {
 *   "creationDate": "2026-03-25T13:07:58.286916Z",
 *   "keyId": "365656198390743043",
 *   "keyContent": "eyJ0eXBlIjoic2VydmljZWFjY291bnQiLCJrZXlJZCI6IjM2NTY1NjE5ODM5MDc0MzA0MyIsImtleSI6Ii0tLS0tQkVHSU4gUlNBIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUVwQUlCQUFLQ0FRRUE1Z2lrdjdHOTlMellBZ001aCtkeUFNQ3ZMVzVkOTRnRmlVMEs4VlFVelF1K3dUUXJcbmN6YTVQUHBMVGtZRWU1Mm9FeUZ5N2RqS2VrOE1xbEp5c2pzQ214ZGNhT2xOYWx3UENBSk5WZWUxcmd3aFRlVHZcbjRCT0NhQjFEZGlMbWthdTJXNU80dlU2Y0VabUR4ZG84R09wbmhaWnBWMitsMnJVbnVacjV1cTFUTEtHRjJqYklcbmV5WTJYT1F1K3JBK1Y1eko4NFRMU1BzNmxnYTFURHJzVjVhVmlkVmVMQWxTUXJTOVdQUThZaURIdVlSM3J3dDRcbnFLaEVSVkRFUDlEZllGb1NYNm9Ka3pKRGVkb1ZEUGdYZXYvWDh3QmFJN1JhTzFIN294am4zUEd6VnBRYWRZQmpcbnpjM0tLd1l6SXM4eHVzbWMxazhGaDQrVnBNSy9RaHJnMUJqRFBRSURBUUFCQW9JQkFEVTNBSzNiOTM2N2hSa0tcbkYvQUpxY1Rrem1Hcks0L001c0w1a0xOOWFRWjZWaG1wOFBkSlRKYi9yQllpZW4wQ1h0UjJJM2xFY3FyU3lMSktcbk9vQml5RnFLai9VeEs1aVVUV0hqN25JV0ZXQjdLK1V5TmcvWFU0NjBYbHZnL1FmcitsYTdHTHlxaDg1R2ZrWnlcbkV2OE1rd0JEYUlFeXNlS2pqOW9QTVFCdmdsTkxaalFYNVJXM0lqdSszaEpuOEt5bWtERUluSWZwN3ZqM0g5a2Rcbit1cEZJdC9IamFsNVNUeFNsRk8yNHpKZ3Y3eHVZRjNhdXoxVTFRaXhGTTJ1SWp0S2pLZWk2UlVIeEZIU0dyeVlcbjVCakxKSExzODlBVThwNUkxRVkzUHd4aTRjNG8zY0Y0cUVrRTg4U04rcDFGVjRXTjdGbHZubHJoQVFaOVBOdTFcbkVZeGdJWUVDZ1lFQStQMURxc1U0TExaKzZWZTdiL21MU2ZXbG0wNCtsS1draFZuMW9DdUNuN3h4NG1TVW5IcW5cbjUyblAzM1pCL2VDZDhWYURTVVk4YUNwOEF6NTJJUVZ3M2FEY2lRVnZrdjQvM1NDazBHdkpsam52RnUzalV5b2FcbmxYSWV5cklqZ2RQYmR4UWZlQVlUeTQ5ODVzVkZ1MFlTeGphM1F1Qlc5aGlPdkQ0OGpaYnRsQjBDZ1lFQTdJSytcbi9OdXk1K0dUeTJHa3FxQytza3paS3FzbDVhSHVwTGpQL25HL0V4M29jdVdkT1I5NEdReDhQSHJmdHhuMVNUdktcbms3ZDBoQTRxUU4ya2tYTVlOMHE1Qmw4dEdHKzkzdjRjcUl0WmZoWlJvbHZxQVplcTR0YTdnK015RFBQMTRoSCtcblEzaS8xeXZwT0xreEd0SUlUK3daNnJKeHBaNDdmSFMvc005OGdhRUNnWUVBa2FhTnE5cmNob05tOEJjTEpYQ0Rcbnc0cjRDa2FXSXh4V2hrOWVlUWlheTloUGdsQzJBbWRaeXV4QjFvVjJDdzRYTm5NV0w0bnZranV2K2JIVEpuUHBcblZ5eGZkYVFCWmFwbkwzS0dGd25HamFOc01peU1lenk0K2swY3FCUFc0MzVMOW5lR0JROEJDMlh2ZVl0U3hEODBcbmdsREZtVkJrYm1kbEw4YjBZeHN6OVIwQ2dZRUF1bjB0MDN2NHlkYVpEeGxqR2hlOXhpSEthMWFnZnp6OFMyNWVcbnN5ZEZudkZLUks3QkZqVzJJU296SEExWE1hMktOOENwcjJoTXU0UGYxVjN2VWJFTE95MzBUdzNsSlF1WEQ2b1hcbk50OEtKZDI3YU9aSTBoQ2hjbFFYYjV0SjcrUzkwUkNYQ09UQmdBemp6Ukpab2VoVEhaSHhyWm9lK3BTV0cwQ0RcbmxndEZCWUVDZ1lBdFd1bEVJK3FFcEF2WktLZ1N6NWtpQldQUE1CWm9tM3VWaXJzTWdsRXVQTVZTNlBrcVlPczBcbkV3MUtxNWt5anFkbytPSWkvRG40SGNWcU9ja1VTYjIrekJnY1h4MzQ4MnRzV1RoNzVzZm0zbVduZGpzZGY5YTFcbkNpS3R0bDMxN0NQbmp5Z1dDb3hvRHVrKzdmdlczR2xpTXVXaWVwWmlOem5RaEdnallOQ3Erdz09XG4tLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLVxuIiwiZXhwaXJhdGlvbkRhdGUiOiI5OTk5LTEyLTMxVDIzOjU5OjU5WiIsInVzZXJJZCI6IjM2NTY1NjE5ODM1NzE4ODYxMSJ9"
 * }
 * ```
 */
const integrationTestBotKey = JSON.parse(
  await readFile(join(SHARED_DIR, "integration-test-bot.key.json"), "utf-8"),
);
const scopes = `openid profile email urn:zitadel:iam:org:project:id:${projectId}:aud urn:zitadel:iam:org:projects:roles urn:zitadel:iam:user:metadata`;

/**
 * @description JWT Profile: sign a client assertion with the machine JSON key
 * @returns {Promise<string>} Actor token
 */
async function getActorAccessToken() {
  /**
   * @description Decode the keyContent from base64 to get the actual key data. keyContent is base64-encoded JSON.
   * @type {DecodedKeyContent}
   */
  const decodedKey = JSON.parse(
    Buffer.from(integrationTestBotKey.keyContent, "base64").toString("utf-8"),
  );
  const { keyId, key, userId } = decodedKey;
  
  // Convert RSA private key to PKCS8 format that jose can use
  const privateKey = createPrivateKey({ key, format: "pem" });
  const pkcs8Key = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const pk = await importPKCS8(pkcs8Key, "RS256");
  
  const now = Math.floor(Date.now() / 1000);

  // aud must be the issuer base URL (Zitadel's external URL)
  const assertion = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", kid: keyId })
    .setIssuedAt(now)
    .setExpirationTime(now + 60)
    .setIssuer(userId)
    .setSubject(userId)
    .setAudience(ZITADEL_ISSUER)
    .sign(pk);

  const body = new URLSearchParams();

  body.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.set("assertion", assertion);
  // Ask for audiences + roles to ease later introspection, though not strictly needed for actor
  body.set("scope", scopes);

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      `JWT Profile token failed: ${response.status} ${JSON.stringify(json)}`,
    );
  }

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
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("actor_token", actorToken);
  body.set("subject_token_type", "urn:zitadel:params:oauth:token-type:user_id");
  body.set("subject_token", userId);
  body.set("requested_token_type", "urn:ietf:params:oauth:token-type:jwt"); // ask for JWT AT
  body.set("scope", scopes);

  const res = await fetch(TOKEN_ENDPOINT, {
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

const actorToken = await getActorAccessToken();

// Impersonate admin → create book
const adminToken = await impersonate(actorToken, adminUserId);
let response = await callApi(adminToken, "POST", "/books", { title: "My Book" });
console.log("admin create book:", response.status, response.text);

// Impersonate guest → read book
const guestToken = await impersonate(actorToken, guestUserId);
response = await callApi(guestToken, "GET", "/books/book-123");
console.log("guest read book:", response.status, response.text);

/**
 * @typedef {Object} DecodedKeyContent
 * @property {string} type - Key type (e.g. "serviceaccount")
 * @property {string} keyId - Key ID (e.g. "365656198390743043")
 * @property {string} userId - User ID (e.g. "365656198357188611")
 * @property {string} key - Private key
 * @property {string} expirationDate - Expiration date (e.g. "9999-12-31T23:59:59Z")
 */
