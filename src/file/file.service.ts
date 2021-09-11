import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  private readonly s3 = new S3Client({
    region: process.env.S3_REGION,
  });
  private readonly bucket: string = process.env.S3_BUCKET_NAME;
  private readonly cfDistUrl: string = process.env.S3_CF_DIST_URL;
  private readonly s3TargetDir: string = process.env.S3_TARGET_DIR;

  constructor() {}

  async uploadFile(key, file) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${this.s3TargetDir}/${key}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return `${this.cfDistUrl}/${this.s3TargetDir}/${key}`;
  }

  async deleteFile(key) {
    const res = await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    console.log(res);
  }
}
