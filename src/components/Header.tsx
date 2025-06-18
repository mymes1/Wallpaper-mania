import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import { Sun, Moon, Sparkles } from 'lucide-react'

export function Header() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-950/75">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Wallpaper Mania
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/gallery">
            <Button variant="ghost">Gallery</Button>
          </Link>
          <Link to="/generate">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
              Generate
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </nav>
      </div>
    </header>
  )
}