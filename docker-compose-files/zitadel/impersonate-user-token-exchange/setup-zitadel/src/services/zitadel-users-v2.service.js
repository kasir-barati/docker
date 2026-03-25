// @ts-check

import { isEmpty, Logger } from "../utils/index.js";

/**
 * Service for interacting with `/v2/users` endpoints of ZITADEL API.
 */
export class ZitadelUsersV2Service {
  /**
   * @param {string} baseUrl - ZITADEL base URL
   * @param {string} accessToken - Bearer token for authentication
   */
  constructor(baseUrl, accessToken) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Create a human user in ZITADEL
   * @param {Object} params - User creation parameters
   * @param {string} params.email - User email
   * @param {string} params.firstName - User first name
   * @param {string} params.lastName - User last name
   * @param {string} params.password - User password
   * @returns {Promise<string>} User ID or null on failure
   */
  async createHumanUser({ email, firstName, lastName, password }) {
    const username = email.split("@")[0];

    const response = await fetch(`${this.baseUrl}/v2/users/human`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        profile: {
          givenName: firstName,
          familyName: lastName,
          displayName: `${firstName} ${lastName}`,
        },
        email: {
          email,
          isVerified: true,
        },
        password: {
          password,
          changeRequired: false,
        },
      }),
    });

    const data = await response.json();

    if (data.userId) {
      return data.userId;
    }

    if (JSON.stringify(data).toLowerCase().includes("already")) {
      return await this.#findUserByEmail(email);
    }

    Logger.error(
      `Failed to create a human user: ${JSON.stringify(data, null, 2)}`,
    );
    throw new Error(`Failed to create human user`);
  }

  /**
   * Create a machine user (service account) in ZITADEL
   * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateUser
   * @param {MachineUserParams} params - Machine user creation parameters
   * @returns {Promise<string>} User ID
   */
  async createMachineUser({
    organizationId,
    username,
    name,
    description = "Machine user for token exchange",
    accessTokenType = "ACCESS_TOKEN_TYPE_JWT",
  }) {
    const response = await fetch(`${this.baseUrl}/v2/users/new`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId,
        username,
        machine: {
          name,
          description,
          accessTokenType,
        },
      }),
    });
    const data = await response.json();

    if (data.id) {
      return data.id;
    }

    if (JSON.stringify(data).toLowerCase().includes("already")) {
      return await this.#findUserByUsername(username);
    }

    throw new Error(
      `Failed to create machine user: ${JSON.stringify(data, null, 2)}`,
    );
  }

  /**
   * Create a JSON key for a machine user (service user).
   * @param {string} userId
   * @param {string} [expirationDate] https://www.rfc-editor.org/rfc/rfc3339.html
   * @returns {Promise<{type:string,keyId:string,key?:string,userId:string}>}
   */
  async addKey(userId, expirationDate) {
    const response = await fetch(`${this.baseUrl}/v2/users/${userId}/keys`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expirationDate ? { expirationDate } : {}),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `AddKey failed for user ${userId}: ${response.status} ${JSON.stringify(data)}`,
      );
    }

    return data;
  }

  /**
   * Find a user by username
   * @param {string} username - Username
   * @returns {Promise<string>} User ID
   */
  async #findUserByUsername(username) {
    const response = await fetch(`${this.baseUrl}/v2/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queries: [
          {
            userNameQuery: {
              userName: username,
              method: "TEXT_QUERY_METHOD_EQUALS",
            },
          },
        ],
      }),
    });

    const data = await response.json();
    const userId = data.result?.[0]?.userId;

    if (!userId) {
      throw new Error(`User not found: ${username}`);
    }

    return userId;
  }

  /**
   * Find a user by email address
   * @param {string} email - User email
   * @returns {Promise<string>} User ID
   */
  async #findUserByEmail(email) {
    const response = await fetch(`${this.baseUrl}/v2/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queries: [
          {
            emailQuery: {
              emailAddress: email,
              method: "TEXT_QUERY_METHOD_EQUALS",
            },
          },
        ],
      }),
    });

    const data = await response.json();
    const userId = data.result?.[0]?.userId;

    if (isEmpty(userId)) {
      throw new Error(`User not found: ${email}`);
    }

    return userId;
  }
}

/**
 * @typedef {'ACCESS_TOKEN_TYPE_BEARER' | 'ACCESS_TOKEN_TYPE_JWT'} AccessTokenType
 *
 * @typedef {Object} MachineUserParams
 * @property {string} organizationId - Organization ID the machine user belongs to
 * @property {string} username - Machine user username
 * @property {string} name - Display name for the machine user
 * @property {string} [description] - Description of the machine user
 * @property {AccessTokenType} [accessTokenType] - Access token type
 */
