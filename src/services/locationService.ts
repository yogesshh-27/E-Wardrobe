import { ILocationService } from './interfaces';
import { POPULAR_DESTINATIONS } from '@/data/mockDestinations';

export class LocationService implements ILocationService {
  async searchDestinations(query: string): Promise<Array<{ city: string; country: string; vibe: string }>> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return POPULAR_DESTINATIONS.map((d) => ({
        city: d.city,
        country: d.country,
        vibe: d.vibe,
      }));
    }

    return POPULAR_DESTINATIONS.filter(
      (d) => d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    ).map((d) => ({
      city: d.city,
      country: d.country,
      vibe: d.vibe,
    }));
  }
}

export const locationService = new LocationService();
