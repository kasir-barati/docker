// @ts-check

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
   * @returns {Promise<string|null>} User ID or null on failure
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

    return null;
  }

  /**
   * Find a user by email address
   * @param {string} email - User email
   * @returns {Promise<string|null>} User ID or null if not found
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
    return data.result?.[0]?.userId || null;
  }
}
