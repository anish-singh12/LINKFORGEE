/**
 * Theme Context
 * Global theme management with localStorage persistence and smooth transitions
 */

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('linkforge-theme') as Theme | null
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
      return 'dark'
    } catch {
      return 'dark'
    }
  })

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved preference
    const savedTheme = localStorage.getItem('linkforge-theme') as Theme | null

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme: Theme = systemPrefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      applyTheme(initialTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('linkforge-theme', newTheme)
    applyTheme(newTheme)
  }

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    // Add transition class for smooth theme change
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease'

    if (newTheme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
      document.body.style.colorScheme = 'light'
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
      document.body.style.colorScheme = 'dark'
    }

    // Remove transition after it completes
    setTimeout(() => {
      root.style.transition = ''
    }, 300)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context
}

