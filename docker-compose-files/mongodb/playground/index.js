// @ts-check

import { connect, Schema, model } from "mongoose";

await connect("mongodb://mongodb:27017/temp", { autoIndex: false });

const TaskSchema = new Schema({
  logs: [Object],
  state: String,
});
const TaskModel = model("Task", TaskSchema);

const MetadataSchema = new Schema({
  someOtherField: String,
  taskId: String,
});
const MetadataModel = model("Metadata", MetadataSchema);

await TaskModel.createCollection();
await MetadataModel.createCollection();

await update();

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

async function create() {
  console.log("Creating task and metadata...");

  const session = await TaskModel.db.startSession();

  try {
    session.startTransaction();
    const task = await TaskModel.create([{ logs: [], state: "initial" }], {
      session,
    });
    const metadata = await MetadataModel.create(
      [{ taskId: task[0]._id.toString() }],
      {
        session,
      },
    );
    await session.commitTransaction();

    return {
      taskId: task[0]._id.toString(),
      metadataId: metadata[0]._id.toString(),
    };
  } catch (error) {
    console.error("Error during creation: ", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
