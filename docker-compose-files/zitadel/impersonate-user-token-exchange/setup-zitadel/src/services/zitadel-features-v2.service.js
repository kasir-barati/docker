// @ts-check

export class ZitadelFeaturesV2Service {
  /**
   * @param {string} baseUrl - ZITADEL base URL
   * @param {string} accessToken - Bearer token for authentication
   */
  constructor(baseUrl, accessToken) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Enable impersonation feature in ZITADEL instance
   * @see https://zitadel.com/docs/reference/api/feature/zitadel.feature.v2.FeatureService.SetInstanceFeatures
   * @param {InstanceFeatures} features - Features to enable
   * @returns {Promise<void>}
   */
  async enableFeature(features) {
    const response = await fetch(`${this.baseUrl}/v2/features/instance`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(features),
    });
    const responseBody = await response.json();

    if (!response.ok && responseBody.code !== 3) {
      throw new Error(
        `Failed to enable impersonation feature: ${JSON.stringify(responseBody, null, 2)}`,
      );
    }
  }
}

/**
 * @typedef {'IMPROVED_PERFORMANCE_UNSPECIFIED' | 'IMPROVED_PERFORMANCE_PROJECT_GRANT' | 'IMPROVED_PERFORMANCE_PROJECT' | 'IMPROVED_PERFORMANCE_USER_GRANT' | 'IMPROVED_PERFORMANCE_ORG_DOMAIN_VERIFIED'} ImprovedPerformance
 *
 * @typedef {Object} LoginV2
 * @property {boolean} [required] - Require that all users must use the new login UI
 * @property {string} [baseUri] - Optionally specify a base uri of the login UI
 *
 * @typedef {Object} InstanceFeatures
 * @property {boolean} [loginDefaultOrg]
 * @property {boolean} [userSchema]
 * @property {boolean} [oidcTokenExchange] deprecated -- enabled by default
 * @property {ImprovedPerformance[]} [improvedPerformance]
 * @property {boolean} [debugOidcParentError]
 * @property {boolean} [oidcSingleV1SessionTermination]
 * @property {boolean} [enableBackChannelLogout] deprecated -- Always enabled
 * @property {LoginV2} [loginV2]
 * @property {boolean} [permissionCheckV2]
 * @property {boolean} [consoleUseV2UserApi]
 * @property {boolean} [enableRelationalTables]
 */
