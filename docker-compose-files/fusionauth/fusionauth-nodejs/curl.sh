curl -X POST \
  http://localhost:9011/api/user/registration/ \
  -H 'X-FusionAuth-TenantId: 40b82d21-2343-40e3-bae0-20b63210bd96' \
  -H 'Authorization: 7ef6fa566cf6bd2948f86dc9174b1ad87a40a67fa00c72edab82d566b79eeb206d532b9f217eac391423d087c0a329bb5518d6281d2bb29c2919642b4cc7300f' \
  -H 'Content-Type: application/json' \
  -d '{
  "registration": {
    "applicationId": "b94471aa-bc85-4538-b1a8-e3c4642c9c8b",
    "data": {
      "displayName": "mohammad"
    },
    "username": "mohammad123"
  },
  "sendSetPasswordEmail": true,
  "user": {
    "email": "email@em.com",
    "firstName": "kasir",
    "lastName": "barati",
    "username": "mohammad123"
  }
}'
