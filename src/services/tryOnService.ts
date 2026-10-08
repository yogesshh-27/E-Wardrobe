import { WardrobeItem } from '@/types';
import { ITryOnService } from './interfaces';

export class TryOnService implements ITryOnService {
  async simulateTryOn(
    userPhotoUrl: string,
    _garments: WardrobeItem[]
  ): Promise<{ previewUrl: string; isSimulation: true; disclaimer: string }> {
    // Artificial inference simulation delay
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // For a mock try-on, we return the user photo as base with a simulated processed indicator
    return {
      previewUrl: userPhotoUrl,
      isSimulation: true,
      disclaimer: 'Preview simulation. Real AI diffusion try-on engine coming soon.',
    };
  }
}

export const tryOnService = new TryOnService();
