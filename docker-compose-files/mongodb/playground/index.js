// @ts-check

import { connect, Schema, model } from "mongoose";

await connect("mongodb://mongodb:27017/temp", { autoIndex: false });

const TaskSchema = new Schema({
  logs: [Object],
});
const TaskModel = model("Task", TaskSchema);

const MetadataSchema = new Schema({
  someOtherField: String,
  taskId: String,
});
const MetadataModel = model("Metadata", MetadataSchema);

await create();

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
