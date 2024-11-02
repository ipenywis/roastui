export const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

import sharp from 'sharp';

export async function compressImage(file: File): Promise<File> {
  const buffer = await file.arrayBuffer();

  const metadata = await sharp(buffer).metadata();

  const compressedBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .resize({
      height: metadata?.height && metadata.height > 800 ? 800 : undefined,
    })
    .toBuffer();

  return new File([compressedBuffer], file.name, { type: 'image/webp' });
}

export async function getImageBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}
