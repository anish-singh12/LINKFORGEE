/**
 * Theme Context
 * Global theme management with localStorage persistence
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
    console.log('[Theme] Initializing theme...')

    // Check for saved preference
    const savedTheme = localStorage.getItem('linkforge-theme') as Theme | null
    console.log('[Theme] Saved theme:', savedTheme)

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      applyTheme(savedTheme)
      console.log('[Theme] Applied saved theme:', savedTheme)
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme: Theme = systemPrefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      applyTheme(initialTheme)
      console.log('[Theme] Applied system theme:', initialTheme)
    }
  }, [])

  const toggleTheme = () => {
    console.log('[Theme] Toggle called, current theme:', theme)
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    console.log('[Theme] Switching to:', newTheme)

    setTheme(newTheme)
    localStorage.setItem('linkforge-theme', newTheme)
    applyTheme(newTheme)
  }

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    console.log('[Theme] Applying theme to DOM:', newTheme)

    if (newTheme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
      document.body.style.colorScheme = 'light'
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
      document.body.style.colorScheme = 'dark'
    }

    console.log('[Theme] DOM classes:', root.className)
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

