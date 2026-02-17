// @ts-check

import { hostname } from "os";
import { connect, Schema, model } from "mongoose";

await connect("mongodb://mongodb:27017/temp", { autoIndex: false });

const OutboxSchema = new Schema(
  { correlationId: String },
  { timestamps: true },
);

OutboxSchema.index({ correlationId: 1 });

const OutboxModel = model("Outbox", OutboxSchema);

await OutboxModel.createCollection();
await OutboxModel.createIndexes();

const session = await OutboxModel.db.startSession();

try {
  session.startTransaction();

  await OutboxModel.insertMany(
    [
      { correlationId: '8621959b-49fd-4a56-89e1-4eb50189ceef' },
      { correlationId: 'c39bbee9-47c5-45d4-9021-e151aa37527a' },
      { correlationId: '73816178-8148-418e-bfa8-4468cc70ddfd' },
      { correlationId: '94fb7ef5-6fcf-43d8-b586-e93b357f1192' },
    ],
    { session },
  );
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  await session.endSession();
}

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