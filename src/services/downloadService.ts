// Enhanced download service that actually works
export interface DownloadOptions {
  filename?: string;
  type?: 'wallpaper' | 'gif';
  quality?: number;
}

export class DownloadService {
  private static instance: DownloadService;
  
  static getInstance(): DownloadService {
    if (!DownloadService.instance) {
      DownloadService.instance = new DownloadService();
    }
    return DownloadService.instance;
  }

  async downloadImage(imageUrl: string, options: DownloadOptions = {}): Promise<boolean> {
    try {
      const { filename, type = 'wallpaper' } = options;
      
      // Generate filename if not provided
      const finalFilename = filename || this.generateFilename(type);
      
      // Check if we're in Android WebView
      if (this.isAndroidApp()) {
        return await this.downloadInAndroid(imageUrl, finalFilename, type);
      } else {
        return await this.downloadInBrowser(imageUrl, finalFilename);
      }
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async downloadMultiple(items: Array<{ url: string; filename?: string; type?: 'wallpaper' | 'gif' }>): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const item of items) {
      try {
        await this.downloadImage(item.url, {
          filename: item.filename,
          type: item.type || 'wallpaper'
        });
        success++;
        
        // Add small delay between downloads to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to download ${item.filename}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }

  private async downloadInAndroid(imageUrl: string, filename: string, type: string): Promise<boolean> {
    try {
      // Check if Android interface is available
      if (typeof (window as any).Android === 'undefined') {
        throw new Error('Android interface not available');
      }

      const android = (window as any).Android;
      
      // Convert image to base64 if it's a data URL, otherwise pass the URL
      let imageData = imageUrl;
      
      if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
        imageData = await this.convertToBase64(imageUrl);
      }

      // Use appropriate Android method based on type
      if (type === 'gif') {
        if (android.downloadGif) {
          await android.downloadGif(imageData, filename);
        } else {
          await android.downloadFile(imageData, filename);
        }
      } else {
        if (android.downloadWallpaper) {
          await android.downloadWallpaper(imageData, filename);
        } else {
          await android.downloadFile(imageData, filename);
        }
      }

      return true;
    } catch (error) {
      console.error('Android download failed, falling back to browser download:', error);
      return await this.downloadInBrowser(imageUrl, filename);
    }
  }

  private async downloadInBrowser(imageUrl: string, filename: string): Promise<boolean> {
    try {
      let blob: Blob;

      if (imageUrl.startsWith('data:')) {
        // Handle data URLs
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else if (imageUrl.startsWith('blob:')) {
        // Handle blob URLs
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else {
        // Handle external URLs with CORS proxy if needed
        try {
          const response = await fetch(imageUrl, { mode: 'cors' });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          blob = await response.blob();
        } catch (corsError) {
          // Try with a CORS proxy
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
          const response = await fetch(proxyUrl);
          if (!response.ok) {
            throw new Error(`Proxy request failed: HTTP ${response.status}`);
          }
          blob = await response.blob();
        }
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Browser download failed:', error);
      throw error;
    }
  }

  private async convertToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to convert to base64: ${error}`);
    }
  }

  private isAndroidApp(): boolean {
    return typeof (window as any).Android !== 'undefined';
  }

  private generateFilename(type: 'wallpaper' | 'gif'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = type === 'gif' ? 'gif' : 'png';
    return `${type}-${timestamp}.${extension}`;
  }

  // Utility method to check available storage (Android only)
  async getAvailableStorage(): Promise<number | null> {
    try {
      if (this.isAndroidApp() && (window as any).Android.getAvailableStorage) {
        return await (window as any).Android.getAvailableStorage();
      }
      return null;
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return null;
    }
  }
}

// Export singleton instance
export const downloadService = DownloadService.getInstance();