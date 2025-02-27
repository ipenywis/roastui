import { RoastedDesigns } from '@prisma/client';

const roastService = {
  async roastUI(name: string, image: File): Promise<RoastedDesigns> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    const response = await fetch('/api/roast', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload');
    }

    const data = await response.json();
    return data;
  },

  async roastUIFormData(formData: FormData): Promise<Response> {
    const response = await fetch('/api/roast-streaming', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload');
    }

    return response;
  },

  async updateRoastUI(formData: FormData): Promise<Response> {
    const response = await fetch('/api/roast-streaming', {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload');
    }

    return response;
  },
};

export default roastService;
