// @ts-check

/**
 * Service for interacting with ZITADEL Auth V1 API endpoints
 */
export class ZitadelAuthV1Service {
  /**
   * @param {string} baseUrl - ZITADEL base URL
   * @param {string} accessToken - Bearer token for authentication
   */
  constructor(baseUrl, accessToken) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Get current authenticated user information
   * @returns {Promise<CurrentUserInfo>} User ID and organization ID of the accessToken
   */
  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/auth/v1/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to get current user: ${JSON.stringify(data, null, 2)}`,
      );
    }

    return {
      userId: data.user.id,
      organizationId: data.user.details?.resourceOwner,
    };
  }
}

/**
 * @typedef {Object} CurrentUserInfo
 * @property {string} userId - User ID
 * @property {string} organizationId - Organization (resource owner) ID
 */
