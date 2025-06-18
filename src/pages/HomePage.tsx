import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Sparkles, Image, Palette } from 'lucide-react'

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] gap-8 text-center px-4">
      <div className="space-y-6">
        <h1 className="text-5xl sm:text-7xl font-bold">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Wallpaper Mania
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create unlimited, stunning wallpapers with the power of AI. Your imagination is the only limit!
        </p>
      </div>
      
      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/generate">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 gap-2">
            <Sparkles className="w-5 h-5" />
            Start Creating
          </Button>
        </Link>
        <Link to="/gallery">
          <Button variant="outline" size="lg" className="gap-2">
            <Image className="w-5 h-5" />
            View Gallery
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
          <Sparkles className="w-10 h-10 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Unlimited Generation</h3>
          <p className="text-gray-600 dark:text-gray-400">Create as many wallpapers as you want, no restrictions!</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
          <Image className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">High Quality</h3>
          <p className="text-gray-600 dark:text-gray-400">Generate stunning 4K resolution wallpapers for any device.</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
          <Palette className="w-10 h-10 text-indigo-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Custom Styles</h3>
          <p className="text-gray-600 dark:text-gray-400">Choose from various styles or create your own unique look.</p>
        </div>
      </div>
    </div>
  )
}