import { ChunkGrpcObject } from './chunk-grpc-object.type';
import { ChunkUploadStatusGrpcObject } from './chunk-upload-status-grpc-object.type';
import { FileServiceClientImplementation } from './file-service-client-implementation.type';
import { UploadResponseGrpcObject } from './upload-response-grpc-object.type';

export interface FileGrpcObject {
  /**@description Package name */
  File: {
    /**@description Service name */
    FileService: FileServiceClientImplementation;
    Chunk: ChunkGrpcObject;
    ChunkUploadStatus: ChunkUploadStatusGrpcObject;
    UploadResponse: UploadResponseGrpcObject;
  };
}
