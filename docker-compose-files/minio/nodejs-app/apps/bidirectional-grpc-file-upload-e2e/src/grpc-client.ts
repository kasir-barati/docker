import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { FileGrpcObject } from '@minio/shared';
import { join } from 'path';

export function getClient() {
  const PROTO_PATH = join(
    __dirname,
    '..',
    '..',
    'bidirectional-grpc-file-upload',
    'src',
    'assets',
    'file.proto',
  );
  const packageDefinition = loadSync(PROTO_PATH, {
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const { File } = loadPackageDefinition(
    packageDefinition,
  ) as unknown as FileGrpcObject;
  const client = new File.FileService(
    'localhost:50051',
    credentials.createInsecure(),
  );

  return client;
}
