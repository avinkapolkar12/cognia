// services/cloudinaryupload.js
import { CLOUDINARY_URL, UPLOAD_PRESET } from '../config';

export const uploadImages = async (imageUris) => {
  const uploadPromises = imageUris.map(async (uri) => {
    const data = new FormData();
    data.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    });
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};