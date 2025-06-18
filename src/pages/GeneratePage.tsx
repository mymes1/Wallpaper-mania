import React from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DownloadButton } from '../components/DownloadButton'
import { Wand2, Heart, Trash2 } from 'lucide-react'
import { generateImage } from '../services/imageService'

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  isFavorite: boolean;
}

export function GeneratePage() {
  const [prompt, setPrompt] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [images, setImages] = React.useState<GeneratedImage[]>([])
  const [error, setError] = React.useState<string | null>(null)

  // Load saved images from localStorage on component mount
  React.useEffect(() => {
    const savedImages = localStorage.getItem('generated-images')
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages))
      } catch (error) {
        console.error('Failed to load saved images:', error)
      }
    }
  }, [])

  // Save images to localStorage whenever images change
  React.useEffect(() => {
    localStorage.setItem('generated-images', JSON.stringify(images))
  }, [images])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const imageUrl = await generateImage(prompt)
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt.trim(),
        timestamp: Date.now(),
        isFavorite: false
      }
      setImages(prev => [newImage, ...prev])
      setPrompt('')
    } catch (error) {
      setError('Failed to generate image. Please try again.')
      console.error('Failed to generate image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleFavorite = (id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
    ))
  }

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const clearAll = () => {
    if (window.confirm('Are you sure you want to delete all generated images?')) {
      setImages([])
    }
  }

  const generateFilename = (prompt: string, index: number) => {
    const cleanPrompt = prompt
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 30)
    return `wallpaper-${cleanPrompt}-${index + 1}.png`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Generate AI Wallpapers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Describe your perfect wallpaper and let AI bring it to life
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex gap-4 mb-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your wallpaper idea... (e.g., 'sunset over mountains', 'abstract cosmic spiral')"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isGenerating) {
                  handleGenerate()
                }
              }}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 gap-2 min-w-[120px]"
            >
              <Wand2 className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p><strong>Tips:</strong> Be specific! Try prompts like:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>"Majestic dragon flying over a burning castle at sunset"</li>
              <li>"Peaceful ocean waves with purple and pink sunset colors"</li>
              <li>"Abstract geometric patterns in neon blue and purple"</li>
              <li>"Snow-covered mountain peaks under starry night sky"</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}

        {images.length > 0 && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Generated Images ({images.length})</h2>
            <Button
              variant="outline"
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative group aspect-square">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(image.id)}
                    className={`${
                      image.isFavorite 
                        ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                        : 'bg-white/90 text-gray-900 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${image.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <DownloadButton
                    imageUrl={image.url}
                    filename={generateFilename(image.prompt, index)}
                    type="wallpaper"
                    variant="outline"
                    size="sm"
                    className="bg-white/90 text-gray-900 hover:bg-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteImage(image.id)}
                    className="bg-white/90 text-red-600 hover:bg-white hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {image.prompt}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                  <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                  {image.isFavorite && (
                    <span className="text-red-500 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current" />
                      Favorite
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <Wand2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No images generated yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Enter a prompt above to create your first AI wallpaper!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}