// @ts-check

import { getConfig } from "./get-config.util.js";

const { apiUrl } = await getConfig();

/**
 *
 * @param {string} token
 * @param {string} method
 * @param {string} path
 * @param {any} [body]
 * @returns {Promise<{status: number, text: string}>}
 */
export async function callApi(token, method, path, body) {
  const res = await fetch(`${apiUrl}${path}`, {
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
