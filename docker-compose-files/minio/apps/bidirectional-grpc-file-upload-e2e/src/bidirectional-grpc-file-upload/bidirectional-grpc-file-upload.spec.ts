import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import { generateChecksum } from '@minio/shared';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

import { getClient } from '../grpc-client';
import { join } from 'path';

describe('Upload a file into Minio', () => {
  it('should be able to upload', async () => {
    const client = getClient();
    const responses = [];
    const upload = client.upload((error, response) => {
      console.log(error);
      console.log(response);
      responses.push(response);
    });
    const fileName = 'upload-me.jpg';
    const filePath = join(__dirname, fileName);
    const { size: totalSize } = await stat(filePath);
    const stream = createReadStream(filePath);
    let partNumber = 1;
    const abortUpload = () => {
      upload.end();
    };

    stream.on('data', (chunk) => {
      upload.write({
        checksum: generateChecksum(
          chunk.toString(),
          ChecksumAlgorithm.SHA256,
          'base64',
        ),
        data: Uint8Array.from(Buffer.from(chunk)),
        fileName: fileName,
        partNumber: partNumber++,
        totalSize,
      });
    });
    stream.on('error', abortUpload).on('end', abortUpload);

    expect(responses.length).toBeGreaterThan(0);
  });
});
