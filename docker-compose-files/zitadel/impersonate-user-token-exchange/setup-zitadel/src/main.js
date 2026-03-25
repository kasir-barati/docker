// @ts-check

import {
  ZitadelAdminV1Service,
  ZitadelAuthV1Service,
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
Logger.ok(
  `Integration Test machine user created with ID: ${integrationTestBotUserId}`,
);
Logger.log(
  "Assigning IAM_END_USER_IMPERSONATOR role to Integration Test bot...",
);
await adminV1Service.assignImpersonatorRole(integrationTestBotUserId);
Logger.ok("Impersonation role assigned to Integration Test bot");

//   // Grant Integration Test bot access to project (this will work because it's in the same org)
//   Logger.log(
//     `Granting E2E bot ${e2eBotUserId} access to project ${projectId}...`,
//   );
//   const e2eBotGrantSuccess =
//     await managementV1Service.grantUserProjectAccess(
//       e2eBotUserId,
//       projectId,
//       ['admin', 'writer', 'user'],
//     );
//   if (e2eBotGrantSuccess) {
//     Logger.ok('E2E bot granted project access');
//   } else {
//     Logger.warn('E2E bot project grant may have failed');
//   }

//   // Generate PAT for E2E bot
//   Logger.log('Generating PAT for E2E machine user...');
//   const e2eBotPat =
//     await managementV1Service.createUserPat(e2eBotUserId);
//   if (isNotEmpty(e2eBotPat)) {
//     Logger.ok(
//       `PAT generated for E2E bot (${e2eBotPat.length} chars)`,
//     );
//     Logger.ok(
//       `Writing E2E bot PAT to ${configService.e2eBotPatFile}`,
//     );
//     await FileUtil.writeFile(
//       configService.e2eBotPatFile,
//       e2eBotPat,
//     );
//   } else {
//     Logger.warn(
//       'Could not generate PAT for E2E bot - token exchange will not work!',
//     );
//   }

//   // Wait and verify the grant
//   Logger.log('Waiting 3 seconds for project grant to propagate...');
//   await sleep(3000);

//   Logger.log('Verifying E2E bot project grant...');
//   const grants =
//     await managementV1Service.listUserGrants(e2eBotUserId);
//   Logger.log(`E2E bot has ${grants.length} project grant(s)`);
//   const projectGrant = grants.find(
//     /** @param {{projectId: string, roleKeys: string[]}} g */
//     (g) => g.projectId === projectId,
//   );
//   if (projectGrant) {
//     Logger.ok(
//       `✓ Confirmed: E2E bot has grant for project ${projectId} with roles: ${projectGrant.roleKeys?.join(', ') || 'none'}`,
//     );
//   } else {
//     Logger.warn(
//       `⚠ Warning: Could not verify E2E bot grant for project ${projectId}`,
//     );
//   }
// }
