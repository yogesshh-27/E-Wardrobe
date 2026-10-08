import { IWeatherService } from './interfaces';
import { POPULAR_DESTINATIONS } from '@/data/mockDestinations';

export class WeatherService implements IWeatherService {
  async getWeatherForCity(cityName: string, _date?: string): Promise<{
    condition: string;
    temperatureCelsius: number;
    description: string;
    icon: string;
  }> {
    // Artificial slight network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const matched = POPULAR_DESTINATIONS.find(
      (d) => d.city.toLowerCase() === cityName.trim().toLowerCase()
    );

    if (matched) {
      return matched.defaultWeather;
    }

    // Default fallback
    return {
      condition: 'Partly Cloudy',
      temperatureCelsius: 23,
      description: 'Pleasant daytime temperatures, ideal for versatile layering.',
      icon: 'CloudSun',
    };
  }
}

export const weatherService = new WeatherService();
