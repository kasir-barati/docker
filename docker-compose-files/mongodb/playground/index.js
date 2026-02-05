// @ts-check

import { uniqueNamesGenerator, adjectives, colors, names } from 'unique-names-generator';
import { connect, Schema, model } from "mongoose";

await connect("mongodb://mongodb:27017/temp", { autoIndex: false });

const TaskSchema = new Schema({
  createdBy: String,
  state: String,
  lockedAt: Date,
  lockedBy: String,
}, { timestamps: true});

TaskSchema.index({ state: 1, lockedAt: 1, lockedBy: 1 });

const TaskModel = model("Task", TaskSchema);

await TaskModel.createCollection();
await TaskModel.createIndexes();

const session = await TaskModel.db.startSession();

try {
  session.startTransaction();
  await TaskModel.insertMany(
    Array.from({ length: 1000 }, () => ({
      createdBy: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, names],
        separator: ' ',
        style: 'capital',
      }),
      state: 'pending',
      lockedAt: null,
      lockedBy: null,
    })),
    { session },
  );
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}

async function findAllAndUpdate() {
  const session = await TaskModel.db.startSession();

  try {
    session.startTransaction();
    const result = await TaskModel.updateMany(
      { state: 'pending', lockedAt: null, lockedBy: null },
      { $set: { lockedAt: new Date(), lockedBy:  } },
      { session },
    ).limit(10);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
