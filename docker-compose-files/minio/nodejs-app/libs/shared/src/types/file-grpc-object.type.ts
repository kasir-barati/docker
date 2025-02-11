import {
  ServiceError,
  ChannelCredentials,
  ServiceDefinition,
  ClientDuplexStream,
} from '@grpc/grpc-js';

type UploadCallback = (
  error: ServiceError,
  response: unknown,
) => void;
export interface UploadRequest {
  partNumber: number;
  fileName: string;
  totalSize: number;
  checksum: string;
  data: Uint8Array;
}
export enum GrpcChunkUploadStatus {
  CLEANED = 3,
  CREATED = 1,
  PLANNED = 0,
  UPLOADED = 2,
}
export interface UploadResponse {
  status: GrpcChunkUploadStatus;
}
interface FileService {
  new (
    url: string,
    credentials: ChannelCredentials,
  ): {
    upload: (
      upload: UploadCallback,
    ) => ClientDuplexStream<UploadRequest, UploadResponse>;
  };
  service: ServiceDefinition;
  /**@example `'FileService'` */
  serviceName: string;
}
export interface FileGrpcObject {
  /**@description Package name */
  File: {
    /**@description Service name */
    FileService: FileService;
  };
}
