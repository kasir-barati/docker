// @ts-check

import { isEmpty, Logger } from "../utils/index.js";

export class ZitadelManagementV1Service {
  /**
   * @param {string} baseUrl - ZITADEL base URL
   * @param {string} accessToken - Bearer token for authentication
   */
  constructor(baseUrl, accessToken) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Create a project in ZITADEL
   * @param {string} projectName - Project name
   * @returns {Promise<string|null>} Project ID or null on failure
   */
  async createProject(projectName) {
    const response = await fetch(`${this.baseUrl}/management/v1/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        projectRoleAssertion: true,
      }),
    });

    const data = await response.json();

    if (data.id) return data.id;

    // Check if project already exists
    if (JSON.stringify(data).toLowerCase().includes("already")) {
      return await this.#findProjectByName(projectName);
    }

    return null;
  }

  /**
   * Create a role in a project
   * @param {string} projectId - Project ID
   * @param {Object} role - Role configuration
   * @param {string} role.group - Role group
   * @param {string} role.roleKey - Role key (e.g., 'admin', 'writer', 'user')
   * @param {string} role.displayName - Role display name
   * @returns {Promise<boolean>} Success status
   */
  async createProjectRole(projectId, { roleKey, displayName, group }) {
    const response = await fetch(
      `${this.baseUrl}/management/v1/projects/${projectId}/roles`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group,
          roleKey,
          displayName,
        }),
      },
    );

    const data = await response.json();
    const responseText = JSON.stringify(data).toLowerCase();

    return responseText.includes("already") || responseText.includes("details");
  }

  /**
   * Create an OIDC application.
   *
   * If the app already exists, this will return its clientId and `clientSecret: null`.
   *
   * @param {string} projectId - Project ID
   * @param {string} appName - Application name
   * @param {'public'|'confidential'} [kind='public'] - OIDC app kind
   * @returns {Promise<{clientId: string, clientSecret: (string|null)}>} public apps do NOT have **client secrets**; for confidential apps the secret is **ONLY** returned on creation.
   */
  async createOidcApp(projectId, appName, kind = "public") {
    /** @type {Record<string, any>} */
    const payload =
      kind === "confidential"
        ? {
            name: appName,
            redirectUris: ["http://localhost:8080/dummy/callback"],
            postLogoutRedirectUris: [],
            responseTypes: ["OIDC_RESPONSE_TYPE_CODE"],
            grantTypes: [
              "OIDC_GRANT_TYPE_REFRESH_TOKEN",
              "OIDC_GRANT_TYPE_TOKEN_EXCHANGE",
              "OIDC_GRANT_TYPE_AUTHORIZATION_CODE",
              "OIDC_GRANT_TYPE_CLIENT_CREDENTIALS",
            ],
            appType: "OIDC_APP_TYPE_WEB",
            authMethodType: "OIDC_AUTH_METHOD_TYPE_BASIC",
            devMode: true,
          }
        : {
            name: appName,
            redirectUris: ["http://localhost:8080/auth/callback"],
            postLogoutRedirectUris: ["http://localhost:8080"],
            responseTypes: ["OIDC_RESPONSE_TYPE_CODE"],
            grantTypes: [
              "OIDC_GRANT_TYPE_AUTHORIZATION_CODE",
              "OIDC_GRANT_TYPE_TOKEN_EXCHANGE",
            ],
            appType: "OIDC_APP_TYPE_NATIVE",
            authMethodType: "OIDC_AUTH_METHOD_TYPE_NONE",
            devMode: true,
          };

    const response = await fetch(
      `${this.baseUrl}/management/v1/projects/${projectId}/apps/oidc`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (data.clientId) {
      return {
        clientId: data.clientId,
        clientSecret: data.clientSecret ?? null,
      };
    }

    if (JSON.stringify(data).toLowerCase().includes("already")) {
      const clientId = await this.#findAppClientId(projectId);
      return { clientId, clientSecret: null };
    }

    Logger.error(
      `Failed to create ${kind} OIDC app: ${JSON.stringify(data, null, 2)}`,
    );
    throw new Error("OIDC app creation failed!");
  }

  /**
   * Assign a role to a user
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @param {'admin'|'guest'} roleKey - Role key to assign
   * @returns {Promise<boolean>} Success status
   */
  async assignRoleToUser(userId, projectId, roleKey) {
    const response = await fetch(
      `${this.baseUrl}/management/v1/users/${userId}/grants`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          roleKeys: [roleKey],
        }),
      },
    );

    const data = await response.json();
    const responseText = JSON.stringify(data).toLowerCase();

    return responseText.includes("already") || responseText.includes("grantid");
  }

  /**
   * Grant a user access to a project with specific roles (needed for token exchange)
   * @param {string} userId - User ID to grant access to
   * @param {string} projectId - Project ID
   * @param {string[]} roleKeys - Array of role keys to grant
   */
  async grantUserProjectAccess(userId, projectId, roleKeys) {
    const response = await fetch(
      `${this.baseUrl}/management/v1/users/${userId}/grants`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          roleKeys,
        }),
      },
    );
    const data = await response.json();
    const responseText = JSON.stringify(data).toLowerCase();
    const success =
      responseText.includes("already") ||
      responseText.includes("grantid") ||
      responseText.includes("details");

    if (!success) {
      Logger.error(
        `Failed to grant user ${userId} access to project ${JSON.stringify(data, null, 2)}`,
      );
      throw new Error("Granting user project access failed!");
    }
  }

  /**
   * Create a Personal Access Token for a user
   * @param {string} userId - User ID
   * @returns {Promise<string>} PAT token
   */
  async createUserPat(userId) {
    const response = await fetch(
      `${this.baseUrl}/management/v1/users/${userId}/pats`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expirationDate: "9999-12-31T23:59:59Z",
        }),
      },
    );
    const data = await response.json();

    if (!data.token) {
      Logger.error(
        `Failed to create PAT for user ${userId}: ${JSON.stringify(data, null, 2)}`,
      );
      throw new Error("Creating user PAT failed!");
    }

    return data.token;
  }

  /**
   * Find a project by name
   * @param {string} projectName - Project name
   * @returns {Promise<string|null>} Project ID or null if not found
   */
  async #findProjectByName(projectName) {
    const response = await fetch(
      `${this.baseUrl}/management/v1/projects/_search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: [
            {
              nameQuery: {
                name: projectName,
                method: "TEXT_QUERY_METHOD_EQUALS",
              },
            },
          ],
        }),
      },
    );

    const data = await response.json();
    return data.result?.[0]?.id || null;
  }

  /**
   * Find first app client ID in a project
   * @param {string} projectId - Project ID
   * @returns {Promise<string>} Client ID
   */
  async #findAppClientId(projectId) {
    const response = await fetch(
      `${this.baseUrl}/management/v1/projects/${projectId}/apps/_search`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    const clientId = data.result?.[0]?.oidcConfig?.clientId;

    if (isEmpty(clientId)) {
      Logger.error(
        `Failed to find existing OIDC app client ID: ${JSON.stringify(data, null, 2)}`,
      );
      throw new Error("Failed to find existing OIDC app client ID");
    }

    return clientId;
  }
}
