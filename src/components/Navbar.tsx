/**
 * Enhanced Navbar Component
 * Displays authenticated state with user avatar dropdown
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import * as authService from '@/services/authService'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Settings, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { BrandLogo } from './BrandLogo'

export function Navbar() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
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
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }

  const handleLogoClick = () => {
    console.log('[Navbar] Logo clicked, navigating to home')
    navigate('/')
  }

  const handleThemeToggle = () => {
    console.log('[Navbar] Theme toggle clicked, current theme:', theme)
    toggleTheme()
  }

  return (
    <nav className="fixed top-0 w-full bg-dark/80 light:bg-white/80 backdrop-blur-md z-50 border-b border-dark-tertiary light:border-gray-200/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo - Now Clickable */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          title="Go to home"
        >
          <BrandLogo />
        </motion.button>

        {/* Navigation Items */}
        <div className="flex gap-4 items-center">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleThemeToggle}
            className="p-2 hover:bg-dark-secondary light:hover:bg-gray-100 rounded-lg transition-colors text-gray-400 light:text-gray-600 hover:text-accent light:hover:text-accent cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {!isAuthenticated && !isLoading ? (
            <>
              <a
                href="/login"
                className="px-4 py-2 text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 transition-colors"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="px-6 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
              >
                Get Started
              </a>
            </>
          ) : isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold hover:scale-110 transition-transform shadow-lg cursor-pointer"
                title={user.email}
              >
                {getAvatarInitial()}
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-dark-secondary light:bg-white border border-dark-tertiary light:border-gray-200 rounded-lg shadow-xl overflow-hidden transition-colors duration-300"
                  >
                    {/* User Email */}
                    <div className="px-4 py-3 border-b border-dark-tertiary light:border-gray-200">
                      <p className="text-xs text-gray-400 light:text-gray-500 uppercase tracking-wider">Account</p>
                      <p className="text-sm font-medium text-white light:text-gray-900 truncate mt-1">{user.email}</p>
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
                    <div className="border-t border-dark-tertiary light:border-gray-200 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-400 light:text-red-600 hover:text-red-300 light:hover:text-red-700 hover:bg-red-500/10 light:hover:bg-red-50 transition-colors flex items-center gap-3 rounded"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
