const aws = require('aws-sdk');
const moment = require('moment');
const sharp = require('sharp');
const md5 = require('md5');
const { v4 } = require('uuid');
const s3 = new aws.S3();

const { create, updateById } = require('./dynamodb');

const TASKS_TABLE = 'ddb-media-api-tasks';
const IMAGES_TABLE = 'ddb-media-api-images';

exports.handler = async function (event, context) {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key);

  console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  console.log('Downloading from ', key);
  const imageS3 = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  const { taskid } = imageS3.Metadata;
  const resolutions = [800, 1024];

  for (const resolution of resolutions) {
    try {
      console.log('Resizing to ', resolution);
      const resizedImage = await sharp(imageS3.Body, { failOn: 'none' })
        .resize({ width: resolution, height: resolution, fit: 'inside' })
        .withMetadata()
        .toBuffer();

      const id = await md5(v4());
      const filename = key.split('/').pop();
      const filenameSplited = filename.split('.');
      const ext = filenameSplited.pop();
      const outputKey = `output/${filenameSplited[0]}/${resolution}/${id}.${ext}`;

      console.log('Saving to ', outputKey);
      await s3
        .putObject({
          Bucket: bucket,
          Key: outputKey,
          Body: resizedImage,
          ACL: 'public-read',
        })
        .promise();
      await create(IMAGES_TABLE, {
        id,
        original: false,
        path: outputKey,
        resolution,
        created: moment().format(),
      });
      console.log('Saved!');
    } catch (err) {
      console.error(err);
    }
  }

  await updateById(
    TASKS_TABLE,
    taskid,
    'SET #state = :state, updated = :updated',
    { ':state': 'resized', ':updated': moment().format() },
    { '#state': 'state' },
  );

  return context.logStreamName;
};
