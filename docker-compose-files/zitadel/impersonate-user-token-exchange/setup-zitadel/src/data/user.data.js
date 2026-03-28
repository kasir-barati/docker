// @ts-check

export const users = [
  {
    userInfo: {
      email: "some-admin@test.com",
      firstName: "Admin",
      lastName: "User",
      password: "Admin123!",
    },
    role: "admin",
    userIdFile: "/zitadel-pat/admin-user-id",
  },
  {
    userInfo: {
      email: "some-guest@test.com",
      firstName: "Guest",
      lastName: "User",
      password: "Guest123!",
    },
    role: "guest",
    userIdFile: "/zitadel-pat/guest-user-id",
  }
]
