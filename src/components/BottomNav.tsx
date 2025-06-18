import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wand2, Heart, Play } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/generate"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/generate') ? 'text-purple-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Wand2 size={24} />
          <span className="text-xs">Generate</span>
        </Link>
        <Link
          to="/gifs"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/gifs') ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Play size={24} />
          <span className="text-xs">GIFs</span>
        </Link>
        <Link
          to="/favorites"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/favorites') ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Heart size={24} />
          <span className="text-xs">Favorites</span>
        </Link>
      </div>
    </nav>
  );
}