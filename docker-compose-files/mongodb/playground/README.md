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
