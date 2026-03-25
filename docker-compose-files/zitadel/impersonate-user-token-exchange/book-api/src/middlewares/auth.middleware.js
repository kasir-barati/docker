// @ts-check

import { createRemoteJWKSet, jwtVerify } from "jose";

import { getProjectId } from "../utils/index.js";

const ISSUER = "http://traefik:80";
const oidcConfiguration = `${ISSUER}/.well-known/openid-configuration`;
const { jwksUri, issuer } = await fetch(oidcConfiguration)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const typedData = /** @type {{ jwks_uri: string, issuer: string }} */ (
      data
    );
    return { jwksUri: typedData.jwks_uri, issuer: typedData.issuer };
  });
const JWKS = createRemoteJWKSet(new URL(jwksUri));

/**
 * Middleware: verify token and attach roles
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function authMiddleware(req, res, next) {
  const projectId = getProjectId();
  try {
    const authz = req.headers.authorization || "";
    if (!authz.startsWith("Bearer ")) throw new Error("missing bearer");
    const token = authz.slice("Bearer ".length);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer, // trust the configured issuer
      // audience is the project id (we requested audience scope)
      audience: projectId,
    });

    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized", detail: String(e) });
  }
}
