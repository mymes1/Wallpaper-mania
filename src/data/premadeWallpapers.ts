interface Wallpaper {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'nature' | 'abstract' | 'cityscape' | 'anime';
}

export const premadeWallpapers: Wallpaper[] = [
  {
    id: 'nature-1',
    title: 'Mountain Sunrise',
    description: 'Serene mountain landscape with a golden sunrise and pine forest',
    imageUrl: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg',
    category: 'nature'
  },
  {
    id: 'nature-2',
    title: 'Ocean Waves',
    description: 'Dramatic ocean waves during sunset with vibrant colors',
    imageUrl: 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg',
    category: 'nature'
  },
  {
    id: 'abstract-1',
    title: 'Cosmic Spiral',
    description: 'Abstract cosmic spiral with vibrant orange and red hues',
    imageUrl: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg',
    category: 'abstract'
  },
  {
    id: 'abstract-2',
    title: 'Neon Dreams',
    description: 'Abstract neon patterns creating a dreamy atmosphere',
    imageUrl: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg',
    category: 'abstract'
  },
  {
    id: 'cityscape-1',
    title: 'Neon City',
    description: 'Futuristic cityscape with neon lights and tall skyscrapers',
    imageUrl: 'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg',
    category: 'cityscape'
  },
  {
    id: 'cityscape-2',
    title: 'City Sunset',
    description: 'Modern city skyline during a beautiful sunset',
    imageUrl: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg',
    category: 'cityscape'
  },
  {
    id: 'anime-1',
    title: 'Cherry Blossoms',
    description: 'Anime-style scene with falling cherry blossoms',
    imageUrl: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg',
    category: 'anime'
  },
  {
    id: 'anime-2',
    title: 'Rainy Day',
    description: 'Anime-inspired cityscape on a rainy evening',
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    category: 'anime'
  }
];