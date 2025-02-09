import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from '@grpc/grpc-js';
import { ServerDuplexStreamImpl } from '@grpc/grpc-js/build/src/server-call';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';

import { FileGrpcObject } from './types/file-grpc-object.type';

const PROTO_PATH = join(__dirname, 'assets', 'file.proto');
const packageDefinition = loadSync(PROTO_PATH, {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const { File } = loadPackageDefinition(
  packageDefinition,
) as unknown as FileGrpcObject;
const server = new Server();

server.addService(File.FileService.service, {
  upload(call: ServerDuplexStreamImpl<unknown, unknown>) {
    call
      .on('data', (something) => {
        console.log(something);
      })
      .on('end', () => {
        call.end();
      });
  },
});
server.bindAsync(
  'localhost:50051',
  ServerCredentials.createInsecure(),
  (error, port) => {
    if (!error) {
      console.log('server is up and running on port ' + port);
      return;
    }

    console.error(error);
    process.exit();
  },
);
