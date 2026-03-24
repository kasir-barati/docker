// @ts-check

import { ZitadelManagementV1Service } from './services/index.js';
import { Logger } from './utils/index.js'

const zitadelUrl = 'http://traefik:80';
const accessToken = '';
const managementV1Service = new ZitadelManagementV1Service(zitadelUrl, accessToken);

Logger.log('Creating OIDC application: smart-novel-app ...');

const projectId = await managementV1Service.createProject('book-project');

if (!projectId) {
    throw new Error('Failed to create project');
}

const clientId = await managementV1Service.createOidcApp(
    projectId,
    'book-app',
);