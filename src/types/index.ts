export interface Wallpaper {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  isFavorite?: boolean;
  category?: string;
}