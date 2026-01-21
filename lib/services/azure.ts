import { BlobServiceClient } from '@azure/storage-blob';

let blobServiceClient: BlobServiceClient | null = null;

function getBlobClient() {
  if (!blobServiceClient && process.env.AZURE_STORAGE_CONNECTION_STRING) {
    blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
  }
  return blobServiceClient;
}

export async function testAzure(action: string) {
  const client = getBlobClient();
  
  if (!client) {
    return {
      success: false,
      message: 'Azure Storage connection string not configured',
      metadata: { error: 'Set AZURE_STORAGE_CONNECTION_STRING environment variable' },
    };
  }

  switch (action) {
    case 'list-containers':
      try {
        const containers = [];
        for await (const container of client.listContainers()) {
          containers.push(container.name);
        }
        return {
          success: true,
          message: `Found ${containers.length} containers`,
          metadata: { containers, count: containers.length },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Azure list containers failed: ${error.message}`,
        };
      }

    case 'upload':
      try {
        const containerName = process.env.AZURE_CONTAINER_NAME || 'test-container';
        const containerClient = client.getContainerClient(containerName);
        await containerClient.createIfNotExists();

        const blobName = `test-${Date.now()}.txt`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const content = `Test blob uploaded at ${new Date().toISOString()}`;

        await blockBlobClient.upload(content, content.length);
        return {
          success: true,
          message: `Blob uploaded: ${blobName}`,
          metadata: { container: containerName, blob: blobName },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Azure upload failed: ${error.message}`,
        };
      }

    case 'download':
      try {
        const containerName = process.env.AZURE_CONTAINER_NAME || 'test-container';
        const blobName = 'test-blob.txt';
        const containerClient = client.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const downloadResponse = await blockBlobClient.download(0);
        const content = await streamToString(downloadResponse.readableStreamBody!);
        return {
          success: true,
          message: `Blob downloaded: ${blobName}`,
          metadata: { container: containerName, blob: blobName, size: content.length },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Azure download failed: ${error.message}`,
          metadata: { error: 'Blob may not exist' },
        };
      }

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }
}

async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    readableStream.on('data', (data) => chunks.push(data));
    readableStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    readableStream.on('error', reject);
  });
}
