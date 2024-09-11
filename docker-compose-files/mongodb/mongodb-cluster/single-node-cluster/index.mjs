// @ts-check

import mongoose from "mongoose";
import { config } from "dotenv";
import { join } from "path";

config({
  path: [join(process.cwd(), ".env")],
});

const {
  MONGO_INITDB_DATABASE,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
} = process.env;
const connectionString = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@db:27017`;

mongoose.connect(connectionString, {
  replicaSet: "rs0",
  autoIndex: true,
  autoCreate: true,
  dbName: MONGO_INITDB_DATABASE,
});

const catSchema = new mongoose.Schema({
  name: String,
});
const Cat = mongoose.model("Cat", catSchema);

const kitty = new Cat({ name: "Zildjian" });

kitty
  .save()
  .then(() => console.log("meow"))
  .catch(console.error);
