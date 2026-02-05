import { MongoClient } from "mongodb";

/*
 * @description
 * The URL needs the username and password once, then you only need to list all other nodes you have in your cluster + database name and replica set name.
 */
const uri =
  "mongodb://my:my@mongodb-primary:27017,mongodb-secondary:27017,mongodb-arbiter:27017/my?replicaSet=rs0";

try {
  const client = new MongoClient(uri);

  await client.connect();
  console.log("Connected to MongoDB Replica Set!");

  const db = client.db("my");
  const collection = db.collection("testcollection");

  const result = await collection.insertOne({
    message: "Hello, MongoDB Replica Set!",
  });
  console.log("Inserted Document:", result.insertedId);

  await client.close();
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}
