export interface UploadResponseGrpcObject {
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
  fileDescriptorProtos: Uint8Array[];
}
