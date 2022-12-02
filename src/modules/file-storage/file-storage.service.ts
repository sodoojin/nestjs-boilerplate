import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import * as crypto from 'crypto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileStorageService {
  private readonly s3Bucket: string;
  private readonly s3BasePath: string;

  constructor(@InjectAwsService(S3) private s3: S3, config: ConfigService) {
    this.s3Bucket = config.get('AWS_S3_BUCKET');
    this.s3BasePath = config.get('AWS_S3_BASE_PATH');
  }

  async delete(destination: string): Promise<boolean> {
    return this.s3
      .deleteObject({
        Key: destination,
        Bucket: this.s3Bucket,
      })
      .promise()
      .then(() => true)
      .catch(() => false);
  }

  async upload(
    file: FileSystemStoredFile,
    destination: string,
  ): Promise<string> {
    let fileName;

    do {
      fileName = crypto.randomBytes(20).toString('hex') + '.' + file.extension;
    } while (
      (await this.s3
        .headObject({
          Bucket: this.s3Bucket,
          Key: path.join(this.s3BasePath, destination, fileName),
        })
        .promise()
        .catch(() => null)) !== null
    );

    const result = await this.s3
      .upload({
        Body: fs.readFileSync(file.path),
        Key: path.join(this.s3BasePath, destination, fileName),
        Bucket: this.s3Bucket,
      })
      .promise();

    return result.Key;
  }
}
