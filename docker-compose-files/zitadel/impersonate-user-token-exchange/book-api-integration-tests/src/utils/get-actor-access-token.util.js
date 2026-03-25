// @ts-check

import { SignJWT, importPKCS8 } from "jose";
import { createPrivateKey } from "node:crypto";

import { getConfig } from "./get-config.util.js";

const { integrationTestBotKey, clientId, clientSecret, scopes, zitadelIssuer, tokenEndpoint } = await getConfig();

/**
 * @description JWT Profile: sign a client assertion with the machine JSON key
 * @returns {Promise<string>} Actor token
 */
export async function getActorAccessToken() {
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
    .setAudience(zitadelIssuer)
    .sign(pk);

  const body = new URLSearchParams();

  body.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.set("assertion", assertion);
  // Add client credentials for JWT Profile grant
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  // Ask for audiences + roles to ease later introspection, though not strictly needed for actor
  body.set("scope", scopes);

  const response = await fetch(tokenEndpoint, {
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
 * @typedef {Object} DecodedKeyContent
 * @property {string} type - Key type (e.g. "serviceaccount")
 * @property {string} keyId - Key ID (e.g. "365656198390743043")
 * @property {string} userId - User ID (e.g. "365656198357188611")
 * @property {string} key - Private key
 * @property {string} expirationDate - Expiration date (e.g. "9999-12-31T23:59:59Z")
 */
