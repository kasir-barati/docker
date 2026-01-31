# MongoDB Playground

- http://localhost:8082/db/temp

## Unset a nullable Field

1. ```js
   await MetadataModel.findOneAndUpdate(
     { _id: metadata._id },
     { $unset: { taskId: 1}, someOtherField: "value" },
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
