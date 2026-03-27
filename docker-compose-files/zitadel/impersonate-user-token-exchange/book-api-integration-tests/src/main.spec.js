// @ts-check

import {
  getConfig,
  getActorAccessToken,
  callApi,
  impersonate,
} from "./utils/index.js";

const { adminUserId, guestUserId } = await getConfig();
const actorToken = await getActorAccessToken();

// Impersonate admin → create book
const adminToken = await impersonate(actorToken, adminUserId);
let response = await callApi(adminToken, "POST", "/books", {
  title: "My Book",
});
console.log("admin create book:", response.status, response.text);

// Impersonate guest → read book
const guestToken = await impersonate(actorToken, guestUserId);
response = await callApi(guestToken, "GET", "/books/book-123");
console.log("guest read book:", response.status, response.text);
