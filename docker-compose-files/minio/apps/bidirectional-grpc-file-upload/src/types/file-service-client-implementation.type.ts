import { Client } from '@grpc/grpc-js';
import { Deserialize, Serialize } from '@grpc/proto-loader';

export interface FileServiceClientImplementation extends Client {
  /**@type {import('@grpc/grpc-js').ServiceDefinition} */
  service: {
    Upload: {
      path: '/File.FileService/Upload';
      requestStream: true;
      responseStream: true;
      requestSerialize: Serialize<unknown>;
      requestDeserialize: Deserialize<unknown>;
      responseSerialize: Serialize<unknown>;
      responseDeserialize: Deserialize<unknown>;
      originalName: 'upload';
      requestType: {
        format: 'Protocol Buffer 3 DescriptorProto';
        type: {
          field: [
            {
              name: 'partNumber';
              extendee: '';
              number: 1;
              label: 'LABEL_OPTIONAL';
              type: 'TYPE_INT32';
              typeName: '';
              defaultValue: '';
              options: null;
              oneofIndex: 0;
              jsonName: '';
            },
            {
              name: 'fileName';
              extendee: '';
              number: 2;
              label: 'LABEL_OPTIONAL';
              type: 'TYPE_STRING';
              typeName: '';
              defaultValue: '';
              options: null;
              oneofIndex: 0;
              jsonName: '';
            },
            {
              name: 'totalSize';
              extendee: '';
              number: 3;
              label: 'LABEL_OPTIONAL';
              type: 'TYPE_FLOAT';
              typeName: '';
              defaultValue: '';
              options: null;
              oneofIndex: 0;
              jsonName: '';
            },
            {
              name: 'checksum';
              extendee: '';
              number: 4;
              label: 'LABEL_OPTIONAL';
              type: 'TYPE_STRING';
              typeName: '';
              defaultValue: '';
              options: null;
              oneofIndex: 0;
              jsonName: '';
            },
            {
              name: 'data';
              extendee: '';
              number: 5;
              label: 'LABEL_OPTIONAL';
              type: 'TYPE_BYTES';
              typeName: '';
              defaultValue: '';
              options: null;
              oneofIndex: 0;
              jsonName: '';
            },
          ];
          nestedType: [];
          enumType: [];
          extensionRange: [];
          extension: [];
          oneofDecl: [];
          reservedRange: [];
          reservedName: [];
          name: 'Chunk';
          options: null;
        };
        fileDescriptorProtos: Uint8Array[];
      };
      responseType: {
        format: 'Protocol Buffer 3 DescriptorProto';
        type: {
          field: [
            {
              name: 'status';
              extendee: '';
              number: 1;
              label: 'LABEL_OPTIONAL';
              type: 'TYPE_ENUM';
              typeName: 'ChunkUploadStatus';
              defaultValue: '';
              options: null;
              oneofIndex: 0;
              jsonName: '';
            },
          ];
          nestedType: [];
          enumType: [];
          extensionRange: [];
          extension: [];
          oneofDecl: [];
          reservedRange: [];
          reservedName: [];
          name: 'UploadResponse';
          options: null;
        };
        fileDescriptorProtos: Uint8Array;
      };
      options: {
        deprecated: false;
        idempotency_level: 'IDEMPOTENCY_UNKNOWN';
        uninterpreted_option: [];
      };
    };
  };
  serviceName: 'FileService';
}
