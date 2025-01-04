import imageConfig from '@/config/image';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3';

const imageService = {
  async uploadImage(userId: string, file: File): Promise<string> {
    const key = `${userId}/${new Date().toISOString()}-${file.name}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: imageConfig.BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
    });

    await s3.send(command);

    return `${imageConfig.ROAST_PUBLIC_DOMAIN}/${key}`;
  },
};

export default imageService;
