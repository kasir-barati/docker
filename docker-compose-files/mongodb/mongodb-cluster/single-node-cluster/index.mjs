// @ts-check

import mongoose from "mongoose";

mongoose.connect("mongodb://root:pass@db:27017", {
  replicaSet: "rs0",
  autoIndex: true,
  autoCreate: true,
  dbName: "app",
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
