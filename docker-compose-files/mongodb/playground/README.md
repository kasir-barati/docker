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

- ```js
  async function create() {
    console.log("Creating task and metadata...");
    const session = await TaskModel.db.startSession();
    try {
      session.startTransaction();
      const task = await TaskModel.create([{ logs: [] }], { session });
      await MetadataModel.create([{ taskId: task[0]._id.toString() }], {
        session,
      });
      await session.commitTransaction();
    } catch (error) {
      console.error("Error during creation: ", error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
  ```
