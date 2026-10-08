export interface DestinationInfo {
  city: string;
  country: string;
  vibe: string;
  defaultWeather: {
    condition: string;
    temperatureCelsius: number;
    description: string;
    icon: string;
  };
  suggestedActivities: string[];
}

export const POPULAR_DESTINATIONS: DestinationInfo[] = [
  {
    city: 'Goa',
    country: 'India',
    vibe: 'Beach, Seafood & Sunset Lounges',
    defaultWeather: {
      condition: 'Sunny & Warm',
      temperatureCelsius: 31,
      description: 'Tropical breeze with sunny skies, high humidity.',
      icon: 'Sun',
    },
    suggestedActivities: ['Beach', 'Dinner', 'Party', 'Casual exploration', 'Water Sports'],
  },
  {
    city: 'Jaipur',
    country: 'India',
    vibe: 'Royal Heritage, Palaces & Bazaars',
    defaultWeather: {
      condition: 'Pleasant & Dry',
      temperatureCelsius: 26,
      description: 'Sunny afternoons with cool desert evenings.',
      icon: 'SunMedium',
    },
    suggestedActivities: ['Sightseeing', 'Shopping', 'Dinner', 'Religious visit', 'Photography'],
  },
  {
    city: 'Delhi',
    country: 'India',
    vibe: 'Historic Monuments, Cafes & Culture',
    defaultWeather: {
      condition: 'Mild & Sunny',
      temperatureCelsius: 24,
      description: 'Clear days with brisk mornings and evenings.',
      icon: 'CloudSun',
    },
    suggestedActivities: ['Sightseeing', 'Shopping', 'Dinner', 'Business', 'Casual exploration'],
  },
  {
    city: 'Mumbai',
    country: 'India',
    vibe: 'Coastal Energy, Art Deco & Nightlife',
    defaultWeather: {
      condition: 'Humid & Breezy',
      temperatureCelsius: 29,
      description: 'Warm sea breeze with pleasant evening strolls.',
      icon: 'Wind',
    },
    suggestedActivities: ['Dinner', 'Party', 'Business', 'Sightseeing', 'Shopping'],
  },
  {
    city: 'Paris',
    country: 'France',
    vibe: 'Haute Couture, Museums & Patisseries',
    defaultWeather: {
      condition: 'Crisp & Overcast',
      temperatureCelsius: 16,
      description: 'Light autumn chill, perfect for trench coats & scarves.',
      icon: 'Cloud',
    },
    suggestedActivities: ['Sightseeing', 'Shopping', 'Dinner', 'Casual exploration', 'Museums'],
  },
  {
    city: 'Udaipur',
    country: 'India',
    vibe: 'Lakeside Romance & Festive Banquets',
    defaultWeather: {
      condition: 'Golden & Clear',
      temperatureCelsius: 25,
      description: 'Serene lake breezes with cool sunset celebrations.',
      icon: 'Sun',
    },
    suggestedActivities: ['Wedding', 'Dinner', 'Sightseeing', 'Casual exploration'],
  },
  {
    city: 'Manali',
    country: 'India',
    vibe: 'Himalayan Pines, Cafes & Treks',
    defaultWeather: {
      condition: 'Cold & Crisp',
      temperatureCelsius: 11,
      description: 'Mountain chill with chilly winds, fleece and jackets essential.',
      icon: 'Snowflake',
    },
    suggestedActivities: ['Hiking', 'Adventure', 'Sightseeing', 'Casual exploration'],
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    vibe: 'Futuristic Architecture & Street Style',
    defaultWeather: {
      condition: 'Mild & Clean',
      temperatureCelsius: 18,
      description: 'Pleasant city walking climate with crisp mornings.',
      icon: 'CloudSun',
    },
    suggestedActivities: ['Shopping', 'Sightseeing', 'Dinner', 'Casual exploration'],
  },
];
