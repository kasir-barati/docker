// @ts-check

import {
  ZitadelAdminV1Service,
  ZitadelAuthV1Service,
  ZitadelManagementV1Service,
  ZitadelUsersV2Service,
} from "./services/index.js";
import { FileUtil, isEmpty, Logger, sleep } from "./utils/index.js";

const zitadelUrl = "http://traefik:80";
/**
 * @description we are mounting the same volume to the setup-zitadel service and the zitadel-init service (lookup `ZITADEL_FIRSTINSTANCE_PATPATH`).
 */
const patFilePath = "/zitadel-pat/token";
const projectIdFile = "/zitadel-pat/project-id";
const clientDir = "/zitadel-pat/client";
const guestUserIdFile = "/zitadel-pat/guest-user-id";
const adminUserIdFile = "/zitadel-pat/admin-user-id";
const integrationTestBotPatFile = "/zitadel-pat/integration-test-bot-token";
const integrationTestBotKeyPath = "/zitadel-pat/integration-test-bot.key.json";
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
const adminV1Service = new ZitadelAdminV1Service(zitadelUrl, accessToken);
const authV1Service = new ZitadelAuthV1Service(zitadelUrl, accessToken);

Logger.section("Setting up Zitadel for Book App");
Logger.log("Ensuring client directory exists...");
await FileUtil.ensureDir(clientDir);

Logger.section("Creating OIDC Project & Application");
Logger.log(`Creating project: ${appName}...`);
const projectId = await managementV1Service.createProject(projectName);
if (isEmpty(projectId)) {
  throw new Error("Failed to create project");
}
Logger.log(`Writing project ID to ${projectIdFile}...`);
await FileUtil.writeFile(projectIdFile, projectId);
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
Logger.log("Assigning role 'admin' to user " + adminUserId + "...");
await managementV1Service.assignRoleToUser(adminUserId, projectId, "admin");
Logger.ok(`Writing admin user ID to ${adminUserIdFile}`);
await FileUtil.writeFile(adminUserIdFile, adminUserId);
Logger.log("Creating user: some-guest@test.com ...");
const guestUserId = await usersV2Service.createHumanUser({
  email: "some-guest@test.com",
  firstName: "Guest",
  lastName: "User",
  password: "Guest123!",
});
Logger.log("Assigning role 'guest' to user " + guestUserId + "...");
await managementV1Service.assignRoleToUser(guestUserId, projectId, "guest");
Logger.ok(`Writing guest user ID to ${guestUserIdFile}`);
await FileUtil.writeFile(guestUserIdFile, guestUserId);

Logger.section("Enabling Impersonation");
Logger.log("Enable impersonation in the security policy...");
await adminV1Service.enableImpersonationInSecurityPolicy();
Logger.section("Granting bot user impersonation permission...");
const { userId: botUserId, organizationId } =
  await authV1Service.getCurrentUser();
Logger.log(
  `Assigning impersonation role to bot user ${botUserId} (org: ${organizationId})...`,
);
await adminV1Service.assignImpersonatorRole(botUserId);
Logger.ok("Impersonation role assigned to bot user");
Logger.log("Creating machine user: integration-test-impersonation-bot...");
const integrationTestBotUserId = await usersV2Service.createMachineUser({
  organizationId,
  username: "integration-test-impersonation-bot",
  name: "Integration Test Impersonation Bot",
  description: "Machine user for integration test token exchange",
});
Logger.log("Creating JSON key for the integration-test bot...");
const botKey = await usersV2Service.addKey(
  integrationTestBotUserId,
  "9999-12-31T23:59:59Z",
);
await FileUtil.writeFile(
  integrationTestBotKeyPath,
  JSON.stringify(botKey, null, 2),
);
Logger.log(
  "Assigning IAM_END_USER_IMPERSONATOR role to Integration Test bot...",
);
await adminV1Service.assignImpersonatorRole(integrationTestBotUserId);
Logger.ok("Impersonation role assigned to Integration Test bot");
Logger.log(
  `Granting Integration Test bot ${integrationTestBotUserId} access to project ${projectId}...`,
);
await managementV1Service.grantUserProjectAccess(
  integrationTestBotUserId,
  projectId,
  ["admin", "guest"],
);
Logger.ok("Integration Test bot got project access");
Logger.log("Generating PAT for integration test machine user...");
const integrationTestBotPat = await managementV1Service.createUserPat(
  integrationTestBotUserId,
);
Logger.ok(
  `PAT generated for integration test bot (${integrationTestBotPat.length} chars)`,
);
Logger.ok(`Writing integration test bot PAT to ${integrationTestBotPatFile}`);
await FileUtil.writeFile(integrationTestBotPatFile, integrationTestBotPat);
Logger.log("Waiting 3 seconds for project grant to propagate...");
await sleep(3000);
Logger.log("Verifying integration test bot project grant...");
const grants = await managementV1Service.listUserGrants(
  integrationTestBotUserId,
);
Logger.log(`integration test bot has ${grants.length} project grant(s)`);
const projectGrant = grants.find((grant) => grant.projectId === projectId);
if (isEmpty(projectGrant)) {
  Logger.error(
    `Integration test bot does NOT have a grant for project ${projectId}. Grants found: ${JSON.stringify(grants, null, 2)}`,
  );
  throw new Error("Integration test bot project grant verification failed!");
}
Logger.ok(
  `✓ Confirmed: integration test bot has grant for project ${projectId} with roles: ${projectGrant.roleKeys?.join(", ") || "none"}`,
);
