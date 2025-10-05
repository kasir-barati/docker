import {
  AbortMultipartUploadCommand,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

const key = randomUUID();
const bucket = "test";
const fileName = "file.mp4";
const client = new S3Client({
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "adminadmin",
    secretAccessKey: "adminadmin",
  },
});

(async () => {
  await uploadFile();
  const thumbnailPath = await generateThumbnail();
  console.log("Thumbnail generated at:", thumbnailPath);
  // TODO: Upload the thumbnail back to MinIO and delete the local thumbnail from /tmp/{key}.jpg
})();

async function generateThumbnail() {
  const { Body } = await client.send(
    new GetObjectCommand({
      Key: key,
      Bucket: bucket,
      // Range: 'bytes=0-1024000', FIXME: this does NOT work with ffmpeg, have to download the whole file!
    })
  );

  if (!Body) {
    throw new Error("Failed to retrieve video data");
  }

  const tempVideoPath = `/tmp/${randomUUID()}.mp4`;
  const thumbnailPath = `/tmp/${randomUUID()}.jpg`;

  await writeFile(tempVideoPath, Body.transformToWebStream());

  const ffmpeg = spawn("ffmpeg", [
    "-ss",
    "00:00:01", // Take frame from 1 second into the video
    "-i",
    tempVideoPath,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    thumbnailPath,
  ]);

  return new Promise<string>((resolve, reject) => {
    ffmpeg
      .on("close", async (code) => {
        if (code !== 0) {
          reject(new Error(`ffmpeg process exited with code ${code}`));
          return;
        }

        await unlink(tempVideoPath);
        resolve(thumbnailPath);
      })
      .on("error", async (err) => {
        console.error("Thumbnail generation failed (on error):", err);

        await unlink(tempVideoPath).catch();

        reject(err);
      });
  });
}

async function uploadFile() {
  let uploadId: string | undefined;
  let partNumber = 1;
  const parts: CompletedPart[] = [];

  try {
    const bufferSizeInByte = 5 * 1024 * 1024;
    const stream = createReadStream(join(process.cwd(), fileName), {
      highWaterMark: bufferSizeInByte,
    });
    const createMultiPartUploadCommand = new CreateMultipartUploadCommand({
      Key: key,
      Bucket: bucket,
      ContentType: "video/mp4",
      ContentDisposition: `attachment; filename="${fileName}"`,
    });
    const createMultiPartUploadResponse = await client.send(
      createMultiPartUploadCommand
    );

    if (!createMultiPartUploadResponse.UploadId) {
      throw "UploadId is missing";
    }

    uploadId = createMultiPartUploadResponse.UploadId;

    for await (const chunk of stream) {
      const uploadPartCommand = new UploadPartCommand({
        Key: key,
        Body: chunk,
        Bucket: bucket,
        UploadId: uploadId,
        PartNumber: partNumber,
      });
      const response = await client.send(uploadPartCommand);

      console.log(response);

      parts.push({
        PartNumber: partNumber++,
        ETag: response.ETag,
      });
    }

    console.log("Parts: ", parts);

    const command = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });
    const response = await client.send(command);

    console.log("AWS response: ");
    console.dir(response, { depth: null });
  } catch (error) {
    if (!uploadId) {
      throw error;
    }

    const command = new AbortMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
    });

    await client.send(command);

    throw error;
  }
}
