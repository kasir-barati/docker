# Bitnami/MongoDB + NestJS

1. `pnpm i --frozen-lockfile`.
2. `cp .env.example .env`.
3. `docker compose up -d`.

<details>
<summary>DNS timeout error(<code>MongoServerSelectionError: getaddrinfo EAI_AGAIN d8c469a78b98</code>)</summary>

```bash
Error connecting to MongoDB: MongoServerSelectionError: getaddrinfo EAI_AGAIN d8c469a78b98
    at Topology.selectServer (/node_modules/mongodb/lib/sdam/topology.js:321:38)
    at async Topology._connect (/node_modules/mongodb/lib/sdam/topology.js:200:28)
    at async Topology.connect (/node_modules/mongodb/lib/sdam/topology.js:152:13)
    at async topologyConnect (/node_modules/mongodb/lib/mongo_client.js:233:17)
    at async MongoClient._connect (/node_modules/mongodb/lib/mongo_client.js:246:13)
    at async MongoClient.connect (/node_modules/mongodb/lib/mongo_client.js:171:13)
    at async file:/index.mjs:12:3 {
  errorLabelSet: Set(0) {},
  reason: TopologyDescription {
    type: 'ReplicaSetNoPrimary',
    servers: Map(3) {
      'd8c469a78b98:27017' => [ServerDescription],
      '04743003427a:27017' => [ServerDescription],
      'a5ef96e5e2e9:27017' => [ServerDescription]
    },
    stale: false,
    compatible: true,
    heartbeatFrequencyMS: 10000,
    localThresholdMS: 15,
    setName: 'rs0',
    maxElectionId: new ObjectId('7fffffff0000000000000002'),
    maxSetVersion: 5,
    commonWireVersion: 0,
    logicalSessionTimeoutMinutes: null
  },
  code: undefined,
  [cause]: MongoNetworkError: getaddrinfo EAI_AGAIN d8c469a78b98
      at Socket.<anonymous> (/node_modules/mongodb/lib/cmap/connect.js:285:44)
      at Object.onceWrapper (node:events:639:26)
      at Socket.emit (node:events:524:28)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    errorLabelSet: Set(1) { 'ResetPool' },
    beforeHandshake: false,
    [cause]: Error: getaddrinfo EAI_AGAIN d8c469a78b98
        at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:120:26) {
      errno: -3001,
      code: 'EAI_AGAIN',
      syscall: 'getaddrinfo',
      hostname: 'd8c469a78b98'
    }
  }
}
```

</details>
