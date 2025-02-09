import { S3Client } from '@aws-sdk/client-s3';

if (
  !process.env.MINIO_REGION ||
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY
) {
  throw 'Invalid env variable value!';
}

export const s3Client = new S3Client({
  region: process.env.MINIO_REGION,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
});
