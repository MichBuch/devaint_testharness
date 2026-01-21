import { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

export async function testAWS(action: string) {
  switch (action) {
    case 'list-buckets':
      try {
        const command = new ListBucketsCommand({});
        const response = await s3Client.send(command);
        return {
          success: true,
          message: `Found ${response.Buckets?.length || 0} buckets`,
          metadata: {
            buckets: response.Buckets?.map(b => b.Name) || [],
            count: response.Buckets?.length || 0,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `AWS S3 list buckets failed: ${error.message}`,
          metadata: { error: 'Check AWS credentials in environment variables' },
        };
      }

    case 'upload':
      try {
        const bucketName = process.env.AWS_S3_BUCKET || 'test-bucket';
        const key = `test-${Date.now()}.txt`;
        const content = `Test file uploaded at ${new Date().toISOString()}`;

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: content,
        });
        await s3Client.send(command);
        return {
          success: true,
          message: `File uploaded to S3: ${key}`,
          metadata: { bucket: bucketName, key },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `AWS S3 upload failed: ${error.message}`,
          metadata: { error: 'Check AWS credentials and bucket configuration' },
        };
      }

    case 'download':
      try {
        const bucketName = process.env.AWS_S3_BUCKET || 'test-bucket';
        const key = 'test-file.txt';

        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        });
        const response = await s3Client.send(command);
        const bodyString = await response.Body?.transformToString();
        return {
          success: true,
          message: `File downloaded from S3: ${key}`,
          metadata: { bucket: bucketName, key, size: bodyString?.length || 0 },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `AWS S3 download failed: ${error.message}`,
          metadata: { error: 'File may not exist or credentials invalid' },
        };
      }

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }
}
