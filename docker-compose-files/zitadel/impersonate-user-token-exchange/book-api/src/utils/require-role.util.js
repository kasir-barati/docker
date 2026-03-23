// @ts-check

import { hasRole } from "./has-role.util.js";

/**
 * Middleware: require a specific role
 *
 * @param {string} roleKey
 * @returns {import("express").RequestHandler}
 */
export function requireRole(roleKey) {
  return (req, res, next) => {
    /** @type {import("express").Request} */
    const request = req;

    if (!request.user) {
      return res.status(401).json({ error: "unauthorized" });
    }
    if (!hasRole(request.user, roleKey)) {
      return res.status(403).json({ error: "forbidden", need: roleKey });
    }
    next();
  };
}
