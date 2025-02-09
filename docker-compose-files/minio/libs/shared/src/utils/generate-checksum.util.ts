import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import { BinaryToTextEncoding, createHash } from 'crypto';

export function generateChecksum(
  content: string,
  algorithm: ChecksumAlgorithm,
  encoding: BinaryToTextEncoding = 'hex',
) {
  return createHash(algorithm)
    .update(content, 'utf-8')
    .digest(encoding);
}
