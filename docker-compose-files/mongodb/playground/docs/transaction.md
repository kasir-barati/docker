# Transactions

## Collection Creation

To prevent getting the following error message you need to create the collections first (i.e. `await TaskModel.createCollection(); await MetadataModel.createCollection()`):

```cmd
app-1  | [nodemon] starting `node index.js`
app-1  | Updating task and metadata...
app-1  | Creating task and metadata...
app-1  | Error during creation:  MongoServerError: Caused by :: Collection namespace 'temp.tasks' is already in use. :: Please retry your operation or multi-document transaction.
app-1  |     at Connection.sendCommand (/app/node_modules/mongodb/lib/cmap/connection.js:320:27)
app-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
app-1  |     at async Connection.command (/app/node_modules/mongodb/lib/cmap/connection.js:344:26)
app-1  |     at async Server.command (/app/node_modules/mongodb/lib/sdam/server.js:208:29)
app-1  |     at async tryOperation (/app/node_modules/mongodb/lib/operations/execute_operation.js:215:32)
app-1  |     at async executeOperation (/app/node_modules/mongodb/lib/operations/execute_operation.js:80:16)
app-1  |     at async ClientSession.commitTransaction (/app/node_modules/mongodb/lib/sessions.js:322:13)
app-1  |     at async create (file:///app/index.js:70:5)
app-1  |     at async update (file:///app/index.js:23:34)
app-1  |     at async file:///app/index.js:19:1 {
app-1  |   errorLabelSet: Set(1) { 'TransientTransactionError' },
app-1  |   errorResponse: {
app-1  |     errorLabels: [ 'TransientTransactionError' ],
app-1  |     ok: 0,
app-1  |     errmsg: "Caused by :: Collection namespace 'temp.tasks' is already in use. :: Please retry your operation or multi-document transaction.",
app-1  |     code: 112,
app-1  |     codeName: 'WriteConflict',
app-1  |     '$clusterTime': {
app-1  |       clusterTime: new Timestamp({ t: 1770093792, i: 3 }),
app-1  |       signature: [Object]
app-1  |     },
app-1  |     operationTime: new Timestamp({ t: 1770093792, i: 2 })
app-1  |   },
app-1  |   ok: 0,
app-1  |   code: 112,
app-1  |   codeName: 'WriteConflict',
app-1  |   '$clusterTime': {
app-1  |     clusterTime: new Timestamp({ t: 1770093792, i: 3 }),
app-1  |     signature: {
app-1  |       hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
app-1  |       keyId: 0
app-1  |     }
app-1  |   },
app-1  |   operationTime: new Timestamp({ t: 1770093792, i: 2 })
app-1  | }
app-1  | /app/node_modules/mongodb/lib/sessions.js:378
app-1  |             throw new error_1.MongoTransactionError('Cannot call abortTransaction after calling commitTransaction');
app-1  |                   ^
app-1  |
app-1  | MongoTransactionError: Cannot call abortTransaction after calling commitTransaction
app-1  |     at ClientSession.abortTransaction (/app/node_modules/mongodb/lib/sessions.js:378:19)
app-1  |     at create (file:///app/index.js:78:19)
app-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
app-1  |     at async update (file:///app/index.js:23:34)
app-1  |     at async file:///app/index.js:19:1 {
app-1  |   errorLabelSet: Set(0) {}
app-1  | }
app-1  |
app-1  | Node.js v24.13.0
app-1  | [nodemon] app crashed - waiting for file changes before starting...
```

<details>
<summary>Code</summary>

```js
async function create() {
  console.log("Creating task and metadata...");
  const session = await TaskModel.db.startSession();
  try {
    session.startTransaction();
    const task = await TaskModel.create([{ logs: [] }], { session });
    const metadata = await MetadataModel.create(
      [{ taskId: task[0]._id.toString() }],
      { session },
    );
    await session.commitTransaction();
    return {
      taskId: task[0]._id.toString(),
      metadataId: metadata[0]._id.toString(),
    };
  } catch (error) {
    console.error("Error during creation: ", error);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
}
```

It is ok to try to touch the same document in separate queries in the same transaction:

```js
async function update() {
  console.log("Updating task and metadata...");
  const { taskId, metadataId } = await create();
  const session = await TaskModel.db.startSession();
  try {
    session.startTransaction();
    await TaskModel.updateOne(
      { _id: taskId },
      { $push: { logs: { message: "This is a log message", timestamp: new Date() } } },
      { session },
    );
    await TaskModel.updateOne(
      { _id: taskId },
      { $set: { state: "updated" } },
      { session },
    );
    await MetadataModel.updateOne(
      { _id: metadataId },
      { $set: { someOtherField: "Updated value" } },
      { session },
    );
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
}
```

</details>

## Replicated NodeJS app Talking to the Same DB

Imagine we have multiple instances of the same application running, i.e. duplicate this service 3 times (`app1`, `app2`, ...):

```yaml
services:
  app1:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    volumes:
      - ./index.js:/app/index.js
  # ...
```

But will they fetch the same document and then what?

```js
import { hostname } from "os";

(async () => {
  const session = await OutboxModel.db.startSession();

  try {
    session.startTransaction();
    const outboxMessage = await OutboxModel.findOneAndDelete(
      { correlationId: 'c39bbee9-47c5-45d4-9021-e151aa37527a' },
      { session}
    );
    console.log(`Hostname: (${hostname()}), outbox message: ${JSON.stringify(outboxMessage, null, 2)}`);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error(`Error: ${JSON.stringify(error, null, 2)}`);
  } finally {
    await session.endSession();
  }
})()
```

### Understanding the Concurrency Issue

This is about **race conditions** and **MongoDB transactions**! Here's what will happen:

When you run 3 instances (`app1`, `app2`, `app3`) simultaneously, they will all fetch the same document and return it, but only one of the instances will delete the document and the other two enter the `catch` block. Here's why:

1. All three start transactions nearly simultaneously.
2. They all attempt to `findOneAndDelete` the same document.
3. **One succeeds** (`app2` for instance).
4. **The other two get WriteConflict errors** because they tried to modify a document that was already being modified by another transaction.

This is MongoDB's [**optimistic concurrency control**](https://www.mongodb.com/docs/manual/faq/concurrency/#how-granular-are-locks-in-mongodb-) in action - when multiple transactions compete for the same document, one wins and the others fail with a `TransientTransactionError` (which is why you see the `TransientTransactionError` label).

The error label `TransientTransactionError` indicates these operations **can be retried** - this is the standard pattern for handling concurrent transactions in MongoDB.

<details>
<summary>Logs of the app</summary>

```cmd
➜  playground git:(main) ✗ docker compose logs app1
app1-1  | 
app1-1  | > test-async-communication@1.0.0 start:dev
app1-1  | > nodemon index.js
app1-1  | 
app1-1  | [nodemon] 3.1.11
app1-1  | [nodemon] to restart at any time, enter `rs`
app1-1  | [nodemon] watching path(s): *.*
app1-1  | [nodemon] watching extensions: js,mjs,cjs,json
app1-1  | [nodemon] starting `node index.js`
app1-1  | Error: {
app1-1  |   "errorLabelSet": {},
app1-1  |   "errorResponse": {
app1-1  |     "errorLabels": [
app1-1  |       "TransientTransactionError"
app1-1  |     ],
app1-1  |     "ok": 0,
app1-1  |     "errmsg": "Caused by :: Write conflict during plan execution and yielding is disabled. :: Please retry your operation or multi-document transaction.",
app1-1  |     "code": 112,
app1-1  |     "codeName": "WriteConflict",
app1-1  |     "$clusterTime": {
app1-1  |       "clusterTime": {
app1-1  |         "$timestamp": "7607791045895520261"
app1-1  |       },
app1-1  |       "signature": {
app1-1  |         "hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAA=",
app1-1  |         "keyId": 0
app1-1  |       }
app1-1  |     },
app1-1  |     "operationTime": {
app1-1  |       "$timestamp": "7607791045895520261"
app1-1  |     }
app1-1  |   },
app1-1  |   "ok": 0,
app1-1  |   "code": 112,
app1-1  |   "codeName": "WriteConflict",
app1-1  |   "$clusterTime": {
app1-1  |     "clusterTime": {
app1-1  |       "$timestamp": "7607791045895520261"
app1-1  |     },
app1-1  |     "signature": {
app1-1  |       "hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAA=",
app1-1  |       "keyId": 0
app1-1  |     }
app1-1  |   },
app1-1  |   "operationTime": {
app1-1  |     "$timestamp": "7607791045895520261"
app1-1  |   }
app1-1  | }
➜  playground git:(main) ✗ docker compose logs app2
app2-1  | 
app2-1  | > test-async-communication@1.0.0 start:dev
app2-1  | > nodemon index.js
app2-1  | 
app2-1  | [nodemon] 3.1.11
app2-1  | [nodemon] to restart at any time, enter `rs`
app2-1  | [nodemon] watching path(s): *.*
app2-1  | [nodemon] watching extensions: js,mjs,cjs,json
app2-1  | [nodemon] starting `node index.js`
app2-1  | Hostname: (32edfb2f6dc7), outbox message: {
app2-1  |   "_id": "69944da6107d0ef28a0ea992",
app2-1  |   "correlationId": "c39bbee9-47c5-45d4-9021-e151aa37527a",
app2-1  |   "__v": 0,
app2-1  |   "createdAt": "2026-02-17T11:14:46.020Z",
app2-1  |   "updatedAt": "2026-02-17T11:14:46.020Z"
app2-1  | }
➜  playground git:(main) ✗ docker compose logs app3
app3-1  | 
app3-1  | > test-async-communication@1.0.0 start:dev
app3-1  | > nodemon index.js
app3-1  | 
app3-1  | [nodemon] 3.1.11
app3-1  | [nodemon] to restart at any time, enter `rs`
app3-1  | [nodemon] watching path(s): *.*
app3-1  | [nodemon] watching extensions: js,mjs,cjs,json
app3-1  | [nodemon] starting `node index.js`
app3-1  | Error: {
app3-1  |   "errorLabelSet": {},
app3-1  |   "errorResponse": {
app3-1  |     "errorLabels": [
app3-1  |       "TransientTransactionError"
app3-1  |     ],
app3-1  |     "ok": 0,
app3-1  |     "errmsg": "Caused by :: Write conflict during plan execution and yielding is disabled. :: Please retry your operation or multi-document transaction.",
app3-1  |     "code": 112,
app3-1  |     "codeName": "WriteConflict",
app3-1  |     "$clusterTime": {
app3-1  |       "clusterTime": {
app3-1  |         "$timestamp": "7607791045895520261"
app3-1  |       },
app3-1  |       "signature": {
app3-1  |         "hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAA=",
app3-1  |         "keyId": 0
app3-1  |       }
app3-1  |     },
app3-1  |     "operationTime": {
app3-1  |       "$timestamp": "7607791045895520261"
app3-1  |     }
app3-1  |   },
app3-1  |   "ok": 0,
app3-1  |   "code": 112,
app3-1  |   "codeName": "WriteConflict",
app3-1  |   "$clusterTime": {
app3-1  |     "clusterTime": {
app3-1  |       "$timestamp": "7607791045895520261"
app3-1  |     },
app3-1  |     "signature": {
app3-1  |       "hash": "AAAAAAAAAAAAAAAAAAAAAAAAAAA=",
app3-1  |       "keyId": 0
app3-1  |     }
app3-1  |   },
app3-1  |   "operationTime": {
app3-1  |     "$timestamp": "7607791045895520261"
app3-1  |   }
app3-1  | }
```

</details>
