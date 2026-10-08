import { IStorageService } from './interfaces';

export class StorageService implements IStorageService {
  async storeImage(file: File): Promise<string> {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif'];
    if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file (JPG, PNG, or WebP).');
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 10MB.');
    }

    // Read file as Data URL for robust client-side persistence
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsDataURL(file);
    });
  }

  async deleteImage(_idOrUrl: string): Promise<void> {
    // For in-memory / data URL storage, no-op
    return Promise.resolve();
  }
}

export const storageService = new StorageService();
