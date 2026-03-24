// @ts-check

import { ZitadelManagementV1Service } from './services/index.js';
import { FileUtil, isEmpty, Logger } from './utils/index.js'

const zitadelUrl = 'http://traefik:80';
/**
 * @description we are mounting the same volume to the setup-zitadel service and the zitadel-init service (lookup `ZITADEL_FIRSTINSTANCE_PATPATH`).
 */
const patFilePath = '/zitadel-pat/token';
const clientDir = '/zitadel-pat/client';
const clientIdFile = `${clientDir}/book-app-id`;
const accessToken = await FileUtil.readPatWithRetries(patFilePath);
const managementV1Service = new ZitadelManagementV1Service(zitadelUrl, accessToken);

Logger.section('Setting up Zitadel for Book App');
Logger.log('Ensuring client directory exists...');
await FileUtil.ensureDir(clientDir);

Logger.section('Creating OIDC Project & Application');
Logger.log('Creating project: book-app...');
const projectId = await managementV1Service.createProject('book-project');
if (isEmpty(projectId)) {
    throw new Error('Failed to create project');
}
Logger.ok(`Project created with ID: ${projectId}`);

Logger.log(`Creating OIDC application: book-app...`)
const clientId = await managementV1Service.createOidcApp(
    projectId,
    'book-app',
);
Logger.ok(`Application created with client ID: ${clientId}`);
Logger.ok(`Writing client ID to ${clientIdFile}`);
await FileUtil.writeFile(clientIdFile, clientId);