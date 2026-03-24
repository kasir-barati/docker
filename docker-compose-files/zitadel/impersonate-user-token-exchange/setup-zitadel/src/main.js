// @ts-check

import {
  ZitadelManagementV1Service,
  ZitadelUsersV2Service,
} from "./services/index.js";
import { FileUtil, isEmpty, isNotEmpty, Logger, sleep } from "./utils/index.js";

const zitadelUrl = "http://traefik:80";
/**
 * @description we are mounting the same volume to the setup-zitadel service and the zitadel-init service (lookup `ZITADEL_FIRSTINSTANCE_PATPATH`).
 */
const patFilePath = "/zitadel-pat/token";
const clientDir = "/zitadel-pat/client";
const guestUserIdFile = "/zitadel-pat/guest-user-id";
const adminUserIdFile = "/zitadel-pat/admin-user-id";
const appName = "book-app";
const projectName = `${appName}-project`;
const confidentialAppName = `integration-test-${appName}`;
const clientIdFile = `${clientDir}/book-app-id`;
const integrationTestClientIdFile = `${clientDir}/integration-test-book-app-id`;
const integrationTestClientSecretFile = `${clientDir}/integration-test-book-app-secret`;
const accessToken = await FileUtil.readPatWithRetries(patFilePath);
const managementV1Service = new ZitadelManagementV1Service(
  zitadelUrl,
  accessToken,
);
const usersV2Service = new ZitadelUsersV2Service(zitadelUrl, accessToken);

Logger.section("Setting up Zitadel for Book App");
Logger.log("Ensuring client directory exists...");
await FileUtil.ensureDir(clientDir);

Logger.section("Creating OIDC Project & Application");
Logger.log(`Creating project: ${appName}...`);
const projectId = await managementV1Service.createProject(projectName);
if (isEmpty(projectId)) {
  throw new Error("Failed to create project");
}
Logger.ok(`Project created with ID: ${projectId}`);

Logger.log(`Creating OIDC application: ${appName}...`);
const { clientId } = await managementV1Service.createOidcApp(
  projectId,
  appName,
);
Logger.ok(`Application created with client ID: ${clientId}`);
Logger.ok(`Writing client ID to ${clientIdFile}`);
await FileUtil.writeFile(clientIdFile, clientId);

Logger.section("Creating Confidential OIDC Application for Integration Tests");
Logger.log(`Creating confidential OIDC application: ${confidentialAppName}...`);
const {
  clientId: integrationTestClientId,
  clientSecret: integrationTestClientSecret,
} = await managementV1Service.createOidcApp(
  projectId,
  confidentialAppName,
  "confidential",
);
Logger.ok(
  `Confidential application created with client ID: ${integrationTestClientId}`,
);
Logger.ok(
  `Writing integration test client ID to ${integrationTestClientIdFile}`,
);
await FileUtil.writeFile(integrationTestClientIdFile, integrationTestClientId);
if (isEmpty(integrationTestClientSecret)) {
  throw new Error(
    "Failed to get the client secret of the confidential application",
  );
}
await FileUtil.writeFile(
  integrationTestClientSecretFile,
  integrationTestClientSecret,
);

Logger.section("Creating Project Roles");
Logger.log("Creating project roles...");
await managementV1Service.createProjectRole(projectId, {
  group: appName,
  roleKey: "admin",
  displayName: "Admin",
});
Logger.ok(`Role 'admin' created`);
await managementV1Service.createProjectRole(projectId, {
  group: appName,
  roleKey: "guest",
  displayName: "Guest",
});
Logger.ok(`Role 'guest' created`);
Logger.log("Small delay for eventual consistency...");
await sleep(2000);

Logger.section("Creating Human Users & Assigning Roles");
Logger.log("Creating user: some-admin@test.com ...");
const adminUserId = await usersV2Service.createHumanUser({
  email: "some-admin@test.com",
  firstName: "Admin",
  lastName: "User",
  password: "Admin123!",
});
if (isNotEmpty(adminUserId)) {
  Logger.log("Assigning role 'admin' to user " + adminUserId + "...");
  await managementV1Service.assignRoleToUser(adminUserId, projectId, "admin");
  Logger.ok(`Writing admin user ID to ${adminUserIdFile}`);
  await FileUtil.writeFile(adminUserIdFile, adminUserId);
}
Logger.log("Creating user: some-guest@test.com ...");
const guestUserId = await usersV2Service.createHumanUser({
  email: "some-guest@test.com",
  firstName: "Guest",
  lastName: "User",
  password: "Guest123!",
});
if (isNotEmpty(guestUserId)) {
  Logger.log("Assigning role 'guest' to user " + guestUserId + "...");
  await managementV1Service.assignRoleToUser(guestUserId, projectId, "guest");
  Logger.ok(`Writing guest user ID to ${guestUserIdFile}`);
  await FileUtil.writeFile(guestUserIdFile, guestUserId);
}
