import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  async list(bucket: string, prefix: string) {
    const { Contents } = await this.client.listObjects({
      Bucket: bucket,
      Prefix: prefix,
    });
    return (
      Contents?.map(
        (item) => `https://${bucket}.s3.amazonaws.com/${item.Key}`,
      ) || []
    );
  }

  async upload(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ) {
    return this.client.putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
      ACL: 'public-read',
    });
  }
}
