import imageConfig from '@/config/image';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';

const imageService = {
  getImageBucketKey(userId: string, file: File) {
    const currentDate = new Date();
    return `${userId}/${currentDate.getTime()}-${file.name.trim().replace(' ', '-')}`;
  },

  getImageBucketKeyFromUrl(imageUrl: string) {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[1];
    const fileNameParts = pathParts[2].split('-');
    const timestamp = fileNameParts[0];
    const fileName = fileNameParts.slice(1).join('-');

    const encodedKey = `${userId}/${timestamp}-${fileName}`;
    return decodeURIComponent(encodedKey);
  },

  async getImageFileFromUrl(imageUrl: string): Promise<File | null> {
    const key = this.getImageBucketKeyFromUrl(imageUrl);

    const command = new GetObjectCommand({
      Bucket: imageConfig.BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);

    const fileBuffer = await response.Body?.transformToByteArray();
    if (!fileBuffer) return null;

    return new File([fileBuffer], key);
  },

  async uploadImage(userId: string, file: File): Promise<string> {
    const key = this.getImageBucketKey(userId, file);

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: imageConfig.BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
    });

    await s3.send(command);

    return `${imageConfig.ROAST_PUBLIC_DOMAIN}/${key}`;
  },

  async deleteImage(imageUrl: string) {
    const key = this.getImageBucketKeyFromUrl(imageUrl);

    const command = new DeleteObjectCommand({
      Bucket: imageConfig.BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
  },

  async isSameImage(imageUrl: string, file: File): Promise<boolean> {
    try {
      const key = this.getImageBucketKeyFromUrl(imageUrl);

      const command = new GetObjectCommand({
        Bucket: imageConfig.BUCKET_NAME,
        Key: key,
      });

      const response = await s3.send(command);

      const existingImageBuffer = await response.Body?.transformToByteArray();
      const newImageArrayBuffer = await file.arrayBuffer();
      const newImageBuffer = Buffer.from(newImageArrayBuffer);

      if (!existingImageBuffer) return false;

      const isMatchUsingArrayBuffers =
        Buffer.from(existingImageBuffer).equals(newImageBuffer);

      if (isMatchUsingArrayBuffers) return true;

      const image = await sharp(newImageBuffer);
      const { width: imageWidth, height: imageHeight } = await image.metadata();
      if (!imageWidth || !imageHeight) return false;

      const diff = pixelmatch(
        existingImageBuffer,
        newImageBuffer,
        null,
        imageWidth,
        imageHeight,
      );

      return diff === 0;
    } catch (err) {
      //eslint-disable-next-line no-console
      console.log('Error in isSameImage', err);
      return false;
    }
  },
};

export default imageService;
