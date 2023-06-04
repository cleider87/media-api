import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';

@Injectable()
export class StorageProvider {
  private readonly client: S3;

  constructor(private configService: ConfigService) {
    this.client = new S3({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
      region: this.configService.get('AWS_REGION'),
    });
  }

  async upload(bucket: string, key: string, body: Buffer) {
    return this.client.putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ACL: 'public-read'
    });
  }
}
