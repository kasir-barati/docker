// @ts-check

import { getConfig } from "./get-config.util.js";

const { clientId, clientSecret, scopes, tokenEndpoint } = await getConfig();

/**
 * 2) Token Exchange (Impersonation) to end up with a *user* token (as JWT)
 * @param {string} actorToken
 * @param {string} userId
 * @returns {Promise<string>}
 */
export async function impersonate(actorToken, userId) {
  const body = new URLSearchParams();

  body.set("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("actor_token", actorToken);
  body.set("actor_token_type", "urn:ietf:params:oauth:token-type:access_token");
  body.set("subject_token_type", "urn:zitadel:params:oauth:token-type:user_id");
  body.set("subject_token", userId);
  body.set("requested_token_type", "urn:ietf:params:oauth:token-type:jwt"); // ask for JWT AT
  body.set("scope", scopes);

  const res = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      `token-exchange failed: ${res.status} ${JSON.stringify(json)}`,
    );
  }

  return json.access_token;
}
