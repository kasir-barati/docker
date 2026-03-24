// @ts-check

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
        const response = await fetch(
            `${this.baseUrl}/management/v1/projects`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: projectName,
                    projectRoleAssertion: true,
                }),
            },
        );

        const data = await response.json();

        if (data.id) {
            return data.id;
        }

        // Check if project already exists
        if (JSON.stringify(data).toLowerCase().includes('already')) {
            return await this.#findProjectByName(projectName);
        }

        return null;
    }

    /**
     * Create an OIDC application (public client)
     * @param {string} projectId - Project ID
     * @param {string} appName - Application name
     * @returns {Promise<string|null>} Client ID or null on failure
     */
    async createOidcApp(projectId, appName) {
        const response = await fetch(
            `${this.baseUrl}/management/v1/projects/${projectId}/apps/oidc`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: appName,
                    redirectUris: ['http://localhost:8080/auth/callback'],
                    postLogoutRedirectUris: ['http://localhost:8080'],
                    responseTypes: ['OIDC_RESPONSE_TYPE_CODE'],
                    grantTypes: [
                        'OIDC_GRANT_TYPE_AUTHORIZATION_CODE',
                        'OIDC_GRANT_TYPE_TOKEN_EXCHANGE',
                    ],
                    appType: 'OIDC_APP_TYPE_NATIVE',
                    authMethodType: 'OIDC_AUTH_METHOD_TYPE_NONE',
                    devMode: true,
                }),
            },
        );

        const data = await response.json();

        if (data.clientId) {
            return data.clientId;
        }

        // Check if app already exists
        if (JSON.stringify(data).toLowerCase().includes('already')) {
            return await this.#findAppClientId(projectId);
        }

        return null;
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
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    queries: [
                        {
                            nameQuery: {
                                name: projectName,
                                method: 'TEXT_QUERY_METHOD_EQUALS',
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
     * @returns {Promise<string|null>} Client ID or null if not found
     */
    async #findAppClientId(projectId) {
        const response = await fetch(
            `${this.baseUrl}/management/v1/projects/${projectId}/apps/_search`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const data = await response.json();
        return data.result?.[0]?.oidcConfig?.clientId || null;
    }
}