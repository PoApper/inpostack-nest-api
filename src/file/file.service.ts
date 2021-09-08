import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

  async uploadFile(dir_path, file, file_name) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${this.s3TargetDir}/${dir_path}/${file_name}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return `${this.cfDistUrl}/${this.s3TargetDir}/${dir_path}/${file_name}`;
  }
}
