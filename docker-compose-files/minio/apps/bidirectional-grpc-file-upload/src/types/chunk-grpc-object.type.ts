export interface ChunkGrpcObject {
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
}
