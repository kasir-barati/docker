const { createMockServer } = require("grpc-mock");
const mockServer = createMockServer({
  protoPath: "/proto/sample.proto",
  packageName: "sample",
  serviceName: "SampleService",
  rules: [
    {
      method: "getSamples",
      input: {},
      output: { f1: "mocked f1" },
    },
  ],
});

mockServer.listen("0.0.0.0:50051");

console.log("Mock server is listening for the incoming requests");
