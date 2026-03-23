// @ts-check

import { getProjectId } from "./get-project-id.util.js";

/**
 * Extract role keys from ZITADEL access token payload
 * @param {any} payload
 * @param {string} roleKey
 * @returns {boolean}
 */
export function hasRole(payload, roleKey) {
  const projectId = getProjectId();
  // Potential claims (both are seen in the wild)
  const c1 = payload["urn:zitadel:iam:org:project:roles"];
  const c2 = payload[`urn:zitadel:iam:org:project:${projectId}:roles`];

  // c1 shape: { "<roleKey>": { "<projectId>": "<domain>" } }
  if (c1 && typeof c1 === "object" && c1[roleKey]) {
    return true;
  }
  // c2 shape: { "<roleKey>": "<domain>" }
  if (c2 && typeof c2 === "object" && c2[roleKey]) {
    return true;
  }
  return false;
}
