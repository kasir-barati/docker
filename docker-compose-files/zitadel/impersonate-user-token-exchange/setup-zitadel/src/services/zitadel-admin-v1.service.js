// @ts-check

import { Logger } from "../utils/index.js";

/**
 * Service for interacting with ZITADEL Admin V1 API endpoints
 */
export class ZitadelAdminV1Service {
  /**
   * @param {string} baseUrl - ZITADEL base URL
   * @param {string} accessToken - Bearer token for authentication
   */
  constructor(baseUrl, accessToken) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Update security policy to enable impersonation
   * @returns {Promise<void>}
   */
  async enableImpersonationInSecurityPolicy() {
    const response = await fetch(`${this.baseUrl}/admin/v1/policies/security`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enableImpersonation: true,
      }),
    });
    const responseBody = await response.json();

    if (!response.ok) {
      Logger.error(`Failed to enable impersonation in security policy: ${JSON.stringify(responseBody, null, 2)}`);
      throw new Error(
        `Failed to enable impersonation in security policy`,
      );
    }
  }

  /**
   * Assign the IAM_END_USER_IMPERSONATOR role to a user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async assignImpersonatorRole(userId) {
    const response = await fetch(`${this.baseUrl}/admin/v1/members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        roles: ["IAM_END_USER_IMPERSONATOR"],
      }),
    });
    const data = await response.json();
    const responseText = JSON.stringify(data).toLowerCase();
    const success =
      responseText.includes("already") ||
      responseText.includes("details") ||
      responseText.includes("userid");

    if (!success) {
      throw new Error(
        `Unexpected response when assigning impersonation role to user (ID: ${userId}): ${JSON.stringify(data, null, 2)}`,
      );
    }
  }
}
