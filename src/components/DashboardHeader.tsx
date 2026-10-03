/**
 * Premium Dashboard Header
 * Polished header with branding, search, and user menu
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import * as authService from '@/services/authService'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Settings, LayoutDashboard, Moon, Sun } from 'lucide-react'
import { BrandLogo } from './BrandLogo'

export function DashboardHeader() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogout = async () => {
    try {
      await authService.signOut()
      setDropdownOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getAvatarInitial = () => {
    const name = user?.user_metadata?.name || user?.email?.charAt(0).toUpperCase() || 'U'
    if (typeof name === 'string' && name.length > 0) {
      return name.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const handleLogoClick = () => {
    console.log('[DashboardHeader] Logo clicked, navigating to hero page')
    navigate('/', { replace: true })
  }

  const handleThemeToggle = () => {
    console.log('[DashboardHeader] Theme toggle clicked, current theme:', theme)
    toggleTheme()
  }

  return (
    <header className="sticky top-0 z-40 bg-dark/80 dark:bg-dark/80 light:bg-white/90 backdrop-blur-xl border-b border-dark-tertiary/50 light:border-slate-200/80 light:shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - Now Clickable */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          title="Go to home"
        >
          <BrandLogo />
        </motion.button>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleThemeToggle}
            className="p-2.5 hover:bg-dark-secondary light:hover:bg-slate-100 border border-transparent light:border-slate-200 rounded-xl transition-colors text-gray-400 light:text-slate-600 hover:text-accent light:hover:text-blue-600 cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </motion.button>

          {/* User Avatar */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold hover:shadow-lg transition-all cursor-pointer"
              title={user?.email}
            >
              {getAvatarInitial()}
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-dark-secondary light:bg-white border border-dark-tertiary/50 light:border-gray-200 rounded-lg shadow-xl overflow-hidden transition-colors duration-300"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-dark-tertiary/50 light:border-gray-200 bg-dark/50 light:bg-gray-50">
                    <p className="text-xs text-gray-400 light:text-gray-500 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-medium text-white light:text-gray-900 truncate mt-1">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/dashboard')
                        setDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 light:text-gray-700 hover:text-white light:hover:text-gray-900 hover:bg-dark/50 light:hover:bg-gray-100 transition-colors flex items-center gap-3"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        navigate('/dashboard/settings')
                        setDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 light:text-gray-700 hover:text-white light:hover:text-gray-900 hover:bg-dark/50 light:hover:bg-gray-100 transition-colors flex items-center gap-3"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-dark-tertiary/50 light:border-gray-200 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 light:text-red-600 light:hover:text-red-700 hover:bg-red-500/10 light:hover:bg-red-50 transition-colors flex items-center gap-3 rounded"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
