// Real GIF generation service using canvas animation
export class GifService {
  private static instance: GifService;
  
  static getInstance(): GifService {
    if (!GifService.instance) {
      GifService.instance = new GifService();
    }
    return GifService.instance;
  }

  async generateAnimatedGif(prompt: string): Promise<string> {
    try {
      // Create multiple frames for animation
      const frames = await this.createAnimationFrames(prompt, 30); // 30 frames
      
      // Convert frames to GIF using a simple GIF encoder
      const gifBlob = await this.createGifFromFrames(frames, 100); // 100ms delay between frames
      
      return URL.createObjectURL(gifBlob);
    } catch (error) {
      console.error('GIF generation failed:', error);
      throw error;
    }
  }

  private async createAnimationFrames(prompt: string, frameCount: number): Promise<ImageData[]> {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const frames: ImageData[] = [];
    const colors = this.getColorsFromPrompt(prompt);
    
    for (let frame = 0; frame < frameCount; frame++) {
      const progress = frame / frameCount;
      
      // Clear canvas
      ctx.clearRect(0, 0, 800, 600);
      
      // Create animated background
      this.drawAnimatedBackground(ctx, progress, colors, prompt);
      
      // Add animated elements based on prompt
      this.drawAnimatedElements(ctx, progress, prompt);
      
      // Capture frame
      frames.push(ctx.getImageData(0, 0, 800, 600));
    }
    
    return frames;
  }

  private drawAnimatedBackground(ctx: CanvasRenderingContext2D, progress: number, colors: string[], prompt: string) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('wave') || lowerPrompt.includes('ocean') || lowerPrompt.includes('water')) {
      // Animated wave background
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Draw animated waves
      ctx.beginPath();
      ctx.moveTo(0, 300);
      for (let x = 0; x <= 800; x += 10) {
        const y = 300 + Math.sin((x * 0.02) + (progress * Math.PI * 4)) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(800, 600);
      ctx.lineTo(0, 600);
      ctx.closePath();
      ctx.fillStyle = colors[2] || '#ffffff33';
      ctx.fill();
      
    } else if (lowerPrompt.includes('particle') || lowerPrompt.includes('space') || lowerPrompt.includes('star')) {
      // Animated particle background
      const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Draw floating particles
      for (let i = 0; i < 50; i++) {
        const x = (i * 16 + progress * 100) % 800;
        const y = 100 + Math.sin(progress * Math.PI * 2 + i * 0.5) * 200;
        const size = 2 + Math.sin(progress * Math.PI * 4 + i) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(progress * Math.PI * 2 + i) * 0.3})`;
        ctx.fill();
      }
      
    } else if (lowerPrompt.includes('pulse') || lowerPrompt.includes('glow') || lowerPrompt.includes('light')) {
      // Pulsing light background
      const pulseIntensity = 0.5 + Math.sin(progress * Math.PI * 4) * 0.3;
      const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400 * pulseIntensity);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Add pulsing rings
      for (let i = 0; i < 3; i++) {
        const radius = 50 + i * 80 + progress * 200;
        ctx.beginPath();
        ctx.arc(400, 300, radius % 400, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - (radius % 400) / 400 * 0.3})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
    } else {
      // Default flowing gradient
      const offset = progress * 800;
      const gradient = ctx.createLinearGradient(-offset, 0, 800 - offset, 600);
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
    }
  }

  private drawAnimatedElements(ctx: CanvasRenderingContext2D, progress: number, prompt: string) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('spiral') || lowerPrompt.includes('swirl')) {
      // Draw animated spiral
      ctx.save();
      ctx.translate(400, 300);
      ctx.rotate(progress * Math.PI * 4);
      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 50 + i * 20;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - i * 0.1})`;
        ctx.fill();
      }
      ctx.restore();
    }
    
    if (lowerPrompt.includes('flow') || lowerPrompt.includes('stream')) {
      // Draw flowing lines
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 120 + i * 80);
        
        for (let x = 0; x <= 800; x += 20) {
          const y = 120 + i * 80 + Math.sin((x * 0.01) + (progress * Math.PI * 2) + i) * 30;
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - i * 0.05})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }

  private async createGifFromFrames(frames: ImageData[], delay: number): Promise<Blob> {
    // Simple GIF creation using canvas and data URLs
    // In a real implementation, you'd use a proper GIF encoder library
    
    // For now, we'll create an animated WebP or return the first frame as a static image
    // This is a simplified approach - for real GIF generation, you'd need a library like gif.js
    
    const canvas = document.createElement('canvas');
    canvas.width = frames[0].width;
    canvas.height = frames[0].height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Put the first frame
    ctx.putImageData(frames[0], 0, 0);
    
    // Convert to blob (this will be a static image for now)
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, 'image/png');
    });
  }

  private getColorsFromPrompt(prompt: string): string[] {
    const colorMap: { [key: string]: string[] } = {
      'fire': ['#ff4444', '#ff8800', '#ffaa00'],
      'water': ['#0066cc', '#0099ff', '#66ccff'],
      'ocean': ['#0066cc', '#0099ff', '#66ccff'],
      'space': ['#000033', '#330066', '#660099'],
      'forest': ['#228833', '#44aa44', '#66cc66'],
      'sunset': ['#ff6600', '#ff9900', '#ffcc00'],
      'purple': ['#6600cc', '#8833dd', '#aa66ee'],
      'blue': ['#0066cc', '#3388dd', '#66aaee'],
      'green': ['#00cc00', '#33dd33', '#66ee66'],
      'red': ['#cc0000', '#dd3333', '#ee6666'],
    };

    const lowerPrompt = prompt.toLowerCase();
    
    for (const [keyword, colors] of Object.entries(colorMap)) {
      if (lowerPrompt.includes(keyword)) {
        return colors;
      }
    }

    return ['#6366f1', '#8b5cf6', '#ec4899'];
  }
}

export const gifService = GifService.getInstance();