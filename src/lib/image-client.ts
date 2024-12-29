declare global {
  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: {
      description: string;
      accept: Record<string, string[]>;
    }[];
  }

  interface Window {
    showSaveFilePicker: (
      options: SaveFilePickerOptions,
    ) => Promise<FileSystemFileHandle>;
  }
}

export async function getImageFileFromUrl(url: string): Promise<File> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'image.webp', { type: 'image/webp' });
  } catch (error) {
    throw error;
  }
}

export const saveFileWithDialog = async (file: File, dataUrl: string) => {
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: file.name,
        types: [
          {
            description: 'Roasted design image',
            accept: { 'image/png': ['.png'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
    } catch (error) {
      // User cancelled the save dialog or other error occurred
    }
  } else {
    // Fallback for older browsers - automatic download
    const link = document.createElement('a');
    link.download = file.name;
    link.href = dataUrl;
    link.click();
  }
};
