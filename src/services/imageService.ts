// Enhanced image generation service with landscape format
export async function generateImage(prompt: string): Promise<string> {
  try {
    // Try multiple free AI image generation APIs with landscape format
    const apis = [
      {
        name: 'Pollinations',
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&seed=${Math.floor(Math.random() * 1000000)}`,
        method: 'GET'
      },
      {
        name: 'Picsum with overlay',
        url: generatePicsumWithText(prompt),
        method: 'CANVAS'
      }
    ];

    // Try Pollinations API first
    try {
      const response = await fetch(apis[0].url);
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.log('Pollinations API failed, trying fallback...');
    }

    // Fallback to canvas generation
    return generateCanvasImage(prompt);
  } catch (error) {
    console.error('All image generation methods failed:', error);
    return generateCanvasImage(prompt);
  }
}

// Generate GIF (animated wallpaper)
export async function generateGif(prompt: string): Promise<string> {
  try {
    // For now, we'll create an animated canvas-based GIF simulation
    return generateAnimatedCanvas(prompt);
  } catch (error) {
    console.error('GIF generation failed:', error);
    return generateCanvasImage(prompt + ' (animated)');
  }
}

function generatePicsumWithText(prompt: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Create background with Picsum image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`;
  
  return new Promise((resolve) => {
    img.onload = () => {
      // Draw the background image
      ctx.drawImage(img, 0, 0, 1920, 1080);
      
      // Add overlay gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
      gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1920, 1080);
      
      // Add text overlay based on prompt
      addTextOverlay(ctx, prompt);
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      resolve(generateCanvasImage(prompt));
    };
  });
}

function generateCanvasImage(prompt: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Create gradient based on prompt keywords
  const colors = getColorsFromPrompt(prompt);
  const gradient = ctx.createRadialGradient(960, 540, 0, 960, 540, 960);
  
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Add geometric patterns based on prompt
  addPatterns(ctx, prompt);
  
  // Add text overlay
  addTextOverlay(ctx, prompt);

  return canvas.toDataURL('image/png');
}

function generateAnimatedCanvas(prompt: string): string {
  // For now, return a static image with animation indicator
  // In a real implementation, you'd create multiple frames
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Create animated-style background
  const colors = getColorsFromPrompt(prompt);
  const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
  
  // Add more color stops for animation effect
  for (let i = 0; i < colors.length; i++) {
    gradient.addColorStop(i / (colors.length - 1), colors[i]);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Add animated-style elements
  addAnimatedElements(ctx, prompt);
  
  // Add "GIF" indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('GIF', 1850, 60);

  return canvas.toDataURL('image/png');
}

function addPatterns(ctx: CanvasRenderingContext2D, prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Add circles for space/cosmic themes
  if (lowerPrompt.includes('space') || lowerPrompt.includes('cosmic') || lowerPrompt.includes('star')) {
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 1920,
        Math.random() * 1080,
        Math.random() * 4 + 1,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
      ctx.fill();
    }
  }
  
  // Add geometric shapes for abstract themes
  if (lowerPrompt.includes('abstract') || lowerPrompt.includes('geometric')) {
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.rect(
        Math.random() * 1600 + 160,
        Math.random() * 800 + 140,
        Math.random() * 300 + 80,
        Math.random() * 200 + 60
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
      ctx.fill();
    }
  }
}

function addAnimatedElements(ctx: CanvasRenderingContext2D, prompt: string) {
  // Add elements that suggest animation
  const lowerPrompt = prompt.toLowerCase();
  
  // Add flowing lines
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * 1080);
    
    for (let x = 0; x < 1920; x += 80) {
      ctx.lineTo(x, Math.sin(x * 0.008 + i) * 150 + 540);
    }
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  // Add pulsing circles
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * 1920,
      Math.random() * 1080,
      Math.random() * 60 + 25,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

function addTextOverlay(ctx: CanvasRenderingContext2D, prompt: string) {
  // Add subtle text overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  
  // Split prompt into words and display key words
  const words = prompt.split(' ').slice(0, 3); // Take first 3 words
  words.forEach((word, index) => {
    ctx.fillText(
      word.toUpperCase(),
      960,
      400 + (index * 100)
    );
  });
}

function getColorsFromPrompt(prompt: string): string[] {
  const colorMap: { [key: string]: string[] } = {
    'dragon': ['#ff4444', '#ff8800', '#ffaa00', '#ff6600'],
    'fire': ['#cc0000', '#ff3300', '#ff6600', '#ffaa00'],
    'ocean': ['#0066cc', '#0099ff', '#66ccff', '#99ddff'],
    'water': ['#0066cc', '#0099ff', '#66ccff', '#99ddff'],
    'sea': ['#0066cc', '#0099ff', '#66ccff', '#99ddff'],
    'forest': ['#228833', '#44aa44', '#66cc66', '#88dd88'],
    'nature': ['#228833', '#44aa44', '#66cc66', '#88dd88'],
    'tree': ['#228833', '#44aa44', '#66cc66', '#88dd88'],
    'sunset': ['#ff6600', '#ff9900', '#ffcc00', '#ffdd44'],
    'sunrise': ['#ff6600', '#ff9900', '#ffcc00', '#ffdd44'],
    'space': ['#000033', '#330066', '#660099', '#9900cc'],
    'cosmic': ['#000033', '#330066', '#660099', '#9900cc'],
    'galaxy': ['#000033', '#330066', '#660099', '#9900cc'],
    'ice': ['#66ccff', '#99ddff', '#cceeee', '#ffffff'],
    'snow': ['#66ccff', '#99ddff', '#cceeee', '#ffffff'],
    'mountain': ['#666666', '#888888', '#aaaaaa', '#cccccc'],
    'desert': ['#cc9966', '#ddaa77', '#eebb88', '#ffcc99'],
    'purple': ['#6600cc', '#8833dd', '#aa66ee', '#cc99ff'],
    'blue': ['#0066cc', '#3388dd', '#66aaee', '#99ccff'],
    'red': ['#cc0000', '#dd3333', '#ee6666', '#ff9999'],
    'green': ['#00cc00', '#33dd33', '#66ee66', '#99ff99'],
    'abstract': ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'],
    'minimal': ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8'],
  };

  const lowerPrompt = prompt.toLowerCase();
  
  // Find matching keywords
  for (const [keyword, colors] of Object.entries(colorMap)) {
    if (lowerPrompt.includes(keyword)) {
      return colors;
    }
  }

  // Default gradient colors
  return ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
}