import React from 'react';
import { DownloadButton } from '../components/DownloadButton';
import { Button } from '../components/ui/Button';
import { Heart, Image, Play, Trash2 } from 'lucide-react';

interface FavoriteItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  type: 'wallpaper' | 'gif';
}

export function FavoritesPage() {
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'wallpaper' | 'gif'>('all');

  React.useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const allFavorites: FavoriteItem[] = [];

    // Load favorite wallpapers
    const savedImages = localStorage.getItem('generated-images');
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages);
        const favoriteImages = images
          .filter((img: any) => img.isFavorite)
          .map((img: any) => ({
            id: img.id,
            url: img.url,
            prompt: img.prompt,
            timestamp: img.timestamp,
            type: 'wallpaper' as const
          }));
        allFavorites.push(...favoriteImages);
      } catch (error) {
        console.error('Failed to load favorite images:', error);
      }
    }

    // Load favorite GIFs
    const savedGifs = localStorage.getItem('generated-gifs');
    if (savedGifs) {
      try {
        const gifs = JSON.parse(savedGifs);
        const favoriteGifs = gifs
          .filter((gif: any) => gif.isFavorite)
          .map((gif: any) => ({
            id: gif.id,
            url: gif.url,
            prompt: gif.prompt,
            timestamp: gif.timestamp,
            type: 'gif' as const
          }));
        allFavorites.push(...favoriteGifs);
      } catch (error) {
        console.error('Failed to load favorite GIFs:', error);
      }
    }

    // Sort by timestamp (newest first)
    allFavorites.sort((a, b) => b.timestamp - a.timestamp);
    setFavorites(allFavorites);
  };

  const removeFavorite = (id: string, type: 'wallpaper' | 'gif') => {
    const storageKey = type === 'wallpaper' ? 'generated-images' : 'generated-gifs';
    const savedItems = localStorage.getItem(storageKey);
    
    if (savedItems) {
      try {
        const items = JSON.parse(savedItems);
        const updatedItems = items.map((item: any) => 
          item.id === id ? { ...item, isFavorite: false } : item
        );
        localStorage.setItem(storageKey, JSON.stringify(updatedItems));
        loadFavorites(); // Reload favorites
      } catch (error) {
        console.error('Failed to remove favorite:', error);
      }
    }
  };

  const generateFilename = (prompt: string, type: 'wallpaper' | 'gif', index: number) => {
    const cleanPrompt = prompt
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 30);
    const extension = type === 'gif' ? 'gif' : 'png';
    return `favorite-${type}-${cleanPrompt}-${index + 1}.${extension}`;
  };

  const filteredFavorites = favorites.filter(item => 
    filter === 'all' || item.type === filter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Favorite Wallpapers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your collection of favorite wallpapers and animated GIFs
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="gap-2"
          >
            <Heart className="w-4 h-4" />
            All ({favorites.length})
          </Button>
          <Button
            variant={filter === 'wallpaper' ? 'default' : 'outline'}
            onClick={() => setFilter('wallpaper')}
            className="gap-2"
          >
            <Image className="w-4 h-4" />
            Wallpapers ({favorites.filter(f => f.type === 'wallpaper').length})
          </Button>
          <Button
            variant={filter === 'gif' ? 'default' : 'outline'}
            onClick={() => setFilter('gif')}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            GIFs ({favorites.filter(f => f.type === 'gif').length})
          </Button>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item, index) => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative group aspect-square">
                <img
                  src={item.url}
                  alt={item.prompt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                    item.type === 'gif' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {item.type === 'gif' ? 'GIF' : 'IMG'}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    FAV
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <DownloadButton
                    imageUrl={item.url}
                    filename={generateFilename(item.prompt, item.type, index)}
                    type={item.type}
                    variant="outline"
                    size="sm"
                    className="bg-white/90 text-gray-900 hover:bg-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFavorite(item.id, item.type)}
                    className="bg-white/90 text-red-600 hover:bg-white hover:text-red-700"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {item.prompt}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span className="capitalize text-red-500 font-medium">
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFavorites.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Start generating wallpapers and mark your favorites!'
                : `No favorite ${filter}s found. Try generating some ${filter}s first!`
              }
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => window.location.href = '/generate'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
              >
                Generate Wallpapers
              </Button>
              <Button
                onClick={() => window.location.href = '/gifs'}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                Create GIFs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;