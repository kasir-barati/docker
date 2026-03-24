// @ts-check

import { ZitadelManagementV1Service } from './services/index.js';
import { FileUtil, Logger } from './utils/index.js'

const zitadelUrl = 'http://traefik:80';
/**
 * @description we are mounting the same volume to the setup-zitadel service and the zitadel-init service (lookup `ZITADEL_FIRSTINSTANCE_PATPATH`).
 */
const patFilePath = '/zitadel-pat/token';
const accessToken = await FileUtil.readPatWithRetries(patFilePath);
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