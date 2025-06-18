import React from 'react';
import Masonry from 'react-masonry-css';
import { type Wallpaper } from '../types';
import { WallpaperCard } from './WallpaperCard';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
}

export function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 2,
    default: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-background"
    >
      {wallpapers.map((wallpaper) => (
        <div key={wallpaper.id} className="mb-4">
          <WallpaperCard wallpaper={wallpaper} />
        </div>
      ))}
    </Masonry>
  );
}