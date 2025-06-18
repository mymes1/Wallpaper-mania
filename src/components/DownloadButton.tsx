import React, { useState } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { downloadService } from '../services/downloadService';
import { Button } from './ui/Button';

interface DownloadButtonProps {
  imageUrl: string;
  filename?: string;
  type?: 'wallpaper' | 'gif';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DownloadButton({ 
  imageUrl, 
  filename, 
  type = 'wallpaper',
  variant = 'outline',
  size = 'sm',
  className 
}: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (status === 'downloading') return;

    setStatus('downloading');
    setError(null);

    try {
      const success = await downloadService.downloadImage(imageUrl, {
        filename,
        type
      });

      if (success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      setError(errorMessage);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'downloading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getText = () => {
    switch (status) {
      case 'downloading':
        return 'Downloading...';
      case 'success':
        return 'Downloaded!';
      case 'error':
        return 'Failed';
      default:
        return 'Download';
    }
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={status === 'downloading'}
        className={className}
        title={error || `Download ${type}`}
      >
        {getIcon()}
        <span className="ml-2">{getText()}</span>
      </Button>
      
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}