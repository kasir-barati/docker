// @ts-check

import { connect, Schema, model } from "mongoose";

await connect('mongodb://mongodb:27017/temp', { autoIndex: false });

const MetadataSchema = new Schema({
  someOtherField: String,
  taskId: String,
});
const MetadataModel = model("Metadata", MetadataSchema);
const metadata = await MetadataModel.create({
  taskId: "697bdc9a408014cad03bec1b",
});

const data = await MetadataModel.findById(metadata._id);

if (data) {
  data.taskId = undefined;
  await data.save();
}

console.log("Tried to unset taskId.");

/**
 * @param {number} minutes
 * @returns {Promise<void>}
 */
function sleep(minutes) {
  return new Promise((resolve) => {
    setTimeout(resolve, minutes * 60 * 1000);
  });
}
