export interface ChunkUploadStatusGrpcObject {
  format: 'Protocol Buffer 3 EnumDescriptorProto';
  type: {
    value: [
      { name: 'PLANNED'; number: 0; options: null },
      { name: 'CREATED'; number: 1; options: null },
      { name: 'UPLOADED'; number: 2; options: null },
      { name: 'CLEANED'; number: 3; options: null },
    ];
    name: 'ChunkUploadStatus';
    options: null;
  };
  fileDescriptorProtos: Uint8Array[];
}
