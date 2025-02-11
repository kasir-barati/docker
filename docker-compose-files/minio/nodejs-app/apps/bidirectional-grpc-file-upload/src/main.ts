import { Upload } from '@aws-sdk/lib-storage';
import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from '@grpc/grpc-js';
import { ServerDuplexStream } from '@grpc/grpc-js/build/src/server-call';
import { loadSync } from '@grpc/proto-loader';
import {
  FileGrpcObject,
  GrpcChunkUploadStatus,
  UploadRequest,
  UploadResponse,
} from '@minio/shared';
import { join } from 'path';
import { PassThrough } from 'stream';

import { s3Client } from './s3-client';

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
  upload(call: ServerDuplexStream<UploadRequest, UploadResponse>) {
    const bucket = 'my-test-bucket';
    const folder = '/some/path';
    const initiate = true;
    const stream = new PassThrough();
    let totalSize = 0;
    let receivedSize = 0;

    call
      .on('data', (uploadRequest: UploadRequest) => {
        if (initiate) {
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: bucket,
              Key: folder,
              Body: stream,
            },
          }).done();
        }
        if (uploadRequest.data) {
          stream.write(uploadRequest.data);
          totalSize = uploadRequest.totalSize;
          receivedSize = uploadRequest.data.length;
        }

        call.write({ status: GrpcChunkUploadStatus.UPLOADED });
      })
      .on('error', (error) => {
        stream.destroy(error);
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
