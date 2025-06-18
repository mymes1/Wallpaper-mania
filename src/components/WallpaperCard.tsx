import React from 'react';
import { cn } from '../utils/cn';
import { Wallpaper } from '../types';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  className?: string;
  onClick?: () => void;
}

export function WallpaperCard({ wallpaper, className, onClick }: WallpaperCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <img
        src={wallpaper.imageUrl}
        alt={wallpaper.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white font-semibold truncate">{wallpaper.title}</h3>
        {wallpaper.description && (
          <p className="text-white/80 text-sm truncate">{wallpaper.description}</p>
        )}
      </div>
    </div>
  );
}