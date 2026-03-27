// @ts-check

import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getConfig() {
  /**
   * @description Zitadel's issuer URL (for JWT audience) must match `ZITADEL_EXTERNALDOMAIN:TRAEFIK_EXPOSED_PORT`
   */
  const zitadelIssuer = "http://localhost:8080";
  /**
   * @description Internal URLs for making actual HTTP requests from within Docker network
   */
  const tokenEndpoint = "http://traefik:80/oauth/v2/token";
  const apiUrl = "http://traefik:80/api";
  const sharedDir = "/zitadel-pat";
  const clientDir = `${sharedDir}/client`;
  const clientId = await readFile(
    join(clientDir, "integration-test-book-app-id"),
    "utf-8",
  );
  const clientSecret = await readFile(
    join(clientDir, "integration-test-book-app-secret"),
    "utf-8",
  );
  const projectId = await readFile(join(sharedDir, "project-id"), "utf-8");
  const guestUserId = await readFile(join(sharedDir, "guest-user-id"), "utf-8");
  const adminUserId = await readFile(join(sharedDir, "admin-user-id"), "utf-8");
  /**
   * @type {{creationDate: string, keyId: string, keyContent: string}}
   * @example
   * ```json
   * {
   *   "creationDate": "2026-03-25T13:07:58.286916Z",
   *   "keyId": "365656198390743043",
   *   "keyContent": "eyJ0eXBlIjoic2VydmljZWFjY291bnQiLCJrZXlJZCI6IjM2NTY1NjE5ODM5MDc0MzA0MyIsImtleSI6Ii0tLS0tQkVHSU4gUlNBIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUVwQUlCQUFLQ0FRRUE1Z2lrdjdHOTlMellBZ001aCtkeUFNQ3ZMVzVkOTRnRmlVMEs4VlFVelF1K3dUUXJcbmN6YTVQUHBMVGtZRWU1Mm9FeUZ5N2RqS2VrOE1xbEp5c2pzQ214ZGNhT2xOYWx3UENBSk5WZWUxcmd3aFRlVHZcbjRCT0NhQjFEZGlMbWthdTJXNU80dlU2Y0VabUR4ZG84R09wbmhaWnBWMitsMnJVbnVacjV1cTFUTEtHRjJqYklcbmV5WTJYT1F1K3JBK1Y1eko4NFRMU1BzNmxnYTFURHJzVjVhVmlkVmVMQWxTUXJTOVdQUThZaURIdVlSM3J3dDRcbnFLaEVSVkRFUDlEZllGb1NYNm9Ka3pKRGVkb1ZEUGdYZXYvWDh3QmFJN1JhTzFIN294am4zUEd6VnBRYWRZQmpcbnpjM0tLd1l6SXM4eHVzbWMxazhGaDQrVnBNSy9RaHJnMUJqRFBRSURBUUFCQW9JQkFEVTNBSzNiOTM2N2hSa0tcbkYvQUpxY1Rrem1Hcks0L001c0w1a0xOOWFRWjZWaG1wOFBkSlRKYi9yQllpZW4wQ1h0UjJJM2xFY3FyU3lMSktcbk9vQml5RnFLai9VeEs1aVVUV0hqN25JV0ZXQjdLK1V5TmcvWFU0NjBYbHZnL1FmcitsYTdHTHlxaDg1R2ZrWnlcbkV2OE1rd0JEYUlFeXNlS2pqOW9QTVFCdmdsTkxaalFYNVJXM0lqdSszaEpuOEt5bWtERUluSWZwN3ZqM0g5a2Rcbit1cEZJdC9IamFsNVNUeFNsRk8yNHpKZ3Y3eHVZRjNhdXoxVTFRaXhGTTJ1SWp0S2pLZWk2UlVIeEZIU0dyeVlcbjVCakxKSExzODlBVThwNUkxRVkzUHd4aTRjNG8zY0Y0cUVrRTg4U04rcDFGVjRXTjdGbHZubHJoQVFaOVBOdTFcbkVZeGdJWUVDZ1lFQStQMURxc1U0TExaKzZWZTdiL21MU2ZXbG0wNCtsS1draFZuMW9DdUNuN3h4NG1TVW5IcW5cbjUyblAzM1pCL2VDZDhWYURTVVk4YUNwOEF6NTJJUVZ3M2FEY2lRVnZrdjQvM1NDazBHdkpsam52RnUzalV5b2FcbmxYSWV5cklqZ2RQYmR4UWZlQVlUeTQ5ODVzVkZ1MFlTeGphM1F1Qlc5aGlPdkQ0OGpaYnRsQjBDZ1lFQTdJSytcbi9OdXk1K0dUeTJHa3FxQytza3paS3FzbDVhSHVwTGpQL25HL0V4M29jdVdkT1I5NEdReDhQSHJmdHhuMVNUdktcbms3ZDBoQTRxUU4ya2tYTVlOMHE1Qmw4dEdHKzkzdjRjcUl0WmZoWlJvbHZxQVplcTR0YTdnK015RFBQMTRoSCtcblEzaS8xeXZwT0xreEd0SUlUK3daNnJKeHBaNDdmSFMvc005OGdhRUNnWUVBa2FhTnE5cmNob05tOEJjTEpYQ0Rcbnc0cjRDa2FXSXh4V2hrOWVlUWlheTloUGdsQzJBbWRaeXV4QjFvVjJDdzRYTm5NV0w0bnZranV2K2JIVEpuUHBcblZ5eGZkYVFCWmFwbkwzS0dGd25HamFOc01peU1lenk0K2swY3FCUFc0MzVMOW5lR0JROEJDMlh2ZVl0U3hEODBcbmdsREZtVkJrYm1kbEw4YjBZeHN6OVIwQ2dZRUF1bjB0MDN2NHlkYVpEeGxqR2hlOXhpSEthMWFnZnp6OFMyNWVcbnN5ZEZudkZLUks3QkZqVzJJU296SEExWE1hMktOOENwcjJoTXU0UGYxVjN2VWJFTE95MzBUdzNsSlF1WEQ2b1hcbk50OEtKZDI3YU9aSTBoQ2hjbFFYYjV0SjcrUzkwUkNYQ09UQmdBemp6Ukpab2VoVEhaSHhyWm9lK3BTV0cwQ0RcbmxndEZCWUVDZ1lBdFd1bEVJK3FFcEF2WktLZ1N6NWtpQldQUE1CWm9tM3VWaXJzTWdsRXVQTVZTNlBrcVlPczBcbkV3MUtxNWt5anFkbytPSWkvRG40SGNWcU9ja1VTYjIrekJnY1h4MzQ4MnRzV1RoNzVzZm0zbVduZGpzZGY5YTFcbkNpS3R0bDMxN0NQbmp5Z1dDb3hvRHVrKzdmdlczR2xpTXVXaWVwWmlOem5RaEdnallOQ3Erdz09XG4tLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLVxuIiwiZXhwaXJhdGlvbkRhdGUiOiI5OTk5LTEyLTMxVDIzOjU5OjU5WiIsInVzZXJJZCI6IjM2NTY1NjE5ODM1NzE4ODYxMSJ9"
   * }
   * ```
   */
  const integrationTestBotKey = JSON.parse(
    await readFile(join(sharedDir, "integration-test-bot.key.json"), "utf-8"),
  );
  const scopes = `openid profile email urn:zitadel:iam:org:project:id:${projectId}:aud urn:zitadel:iam:org:project:id:${projectId}:roles urn:zitadel:iam:user:metadata`;

  return {
    apiUrl,
    scopes,
    clientId,
    adminUserId,
    guestUserId,
    clientSecret,
    tokenEndpoint,
    zitadelIssuer,
    integrationTestBotKey,
  };
}
