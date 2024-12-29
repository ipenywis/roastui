export async function getImageFileFromUrl(url: string): Promise<File> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'image.webp', { type: 'image/webp' });
  } catch (error) {
    throw error;
  }
}
