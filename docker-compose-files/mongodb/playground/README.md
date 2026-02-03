# MongoDB Playground

- http://localhost:8082/db/temp

## Unset a nullable Field

1. ```js
   await MetadataModel.findOneAndUpdate(
     { _id: metadata._id },
     { $unset: { taskId: 1 }, someOtherField: "value" },
   );
   ```
2. ```js
   const metadata = await MetadataModel.findById(metadata._id);
   if (data) {
     data.taskId = undefined;
     data.someOtherField = "value";
     await data.save();
   }
   ```

## Transactions

> [!IMPORTANT]
>
> To prevent getting the following error message you need to create the collections first (i.e. `await TaskModel.createCollection(); await MetadataModel.createCollection()`):
>
> ```cmd
> app-1  | [nodemon] starting `node index.js`
> app-1  | Updating task and metadata...
> app-1  | Creating task and metadata...
> app-1  | Error during creation:  MongoServerError: Caused by :: Collection namespace 'temp.tasks' is already in use. :: Please retry your operation or multi-document transaction.
> app-1  |     at Connection.sendCommand (/app/node_modules/mongodb/lib/cmap/connection.js:320:27)
> app-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
> app-1  |     at async Connection.command (/app/node_modules/mongodb/lib/cmap/connection.js:344:26)
> app-1  |     at async Server.command (/app/node_modules/mongodb/lib/sdam/server.js:208:29)
> app-1  |     at async tryOperation (/app/node_modules/mongodb/lib/operations/execute_operation.js:215:32)
> app-1  |     at async executeOperation (/app/node_modules/mongodb/lib/operations/execute_operation.js:80:16)
> app-1  |     at async ClientSession.commitTransaction (/app/node_modules/mongodb/lib/sessions.js:322:13)
> app-1  |     at async create (file:///app/index.js:70:5)
> app-1  |     at async update (file:///app/index.js:23:34)
> app-1  |     at async file:///app/index.js:19:1 {
> app-1  |   errorLabelSet: Set(1) { 'TransientTransactionError' },
> app-1  |   errorResponse: {
> app-1  |     errorLabels: [ 'TransientTransactionError' ],
> app-1  |     ok: 0,
> app-1  |     errmsg: "Caused by :: Collection namespace 'temp.tasks' is already in use. :: Please retry your operation or multi-document transaction.",
> app-1  |     code: 112,
> app-1  |     codeName: 'WriteConflict',
> app-1  |     '$clusterTime': {
> app-1  |       clusterTime: new Timestamp({ t: 1770093792, i: 3 }),
> app-1  |       signature: [Object]
> app-1  |     },
> app-1  |     operationTime: new Timestamp({ t: 1770093792, i: 2 })
> app-1  |   },
> app-1  |   ok: 0,
> app-1  |   code: 112,
> app-1  |   codeName: 'WriteConflict',
> app-1  |   '$clusterTime': {
> app-1  |     clusterTime: new Timestamp({ t: 1770093792, i: 3 }),
> app-1  |     signature: {
> app-1  |       hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
> app-1  |       keyId: 0
> app-1  |     }
> app-1  |   },
> app-1  |   operationTime: new Timestamp({ t: 1770093792, i: 2 })
> app-1  | }
> app-1  | /app/node_modules/mongodb/lib/sessions.js:378
> app-1  |             throw new error_1.MongoTransactionError('Cannot call abortTransaction after calling commitTransaction');
> app-1  |                   ^
> app-1  |
> app-1  | MongoTransactionError: Cannot call abortTransaction after calling commitTransaction
> app-1  |     at ClientSession.abortTransaction (/app/node_modules/mongodb/lib/sessions.js:378:19)
> app-1  |     at create (file:///app/index.js:78:19)
> app-1  |     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
> app-1  |     at async update (file:///app/index.js:23:34)
> app-1  |     at async file:///app/index.js:19:1 {
> app-1  |   errorLabelSet: Set(0) {}
> app-1  | }
> app-1  |
> app-1  | Node.js v24.13.0
> app-1  | [nodemon] app crashed - waiting for file changes before starting...
> ```

- ```js
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
- It is ok to try to touch the same document in separate queries in the same transaction:
  ```js
  async function update() {
    console.log("Updating task and metadata...");
    const { taskId, metadataId } = await create();
    const session = await TaskModel.db.startSession();
    try {
      session.startTransaction();
      await TaskModel.updateOne(
        { _id: taskId },
        {
          $push: {
            logs: { message: "This is a log message", timestamp: new Date() },
          },
        },
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
