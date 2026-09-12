import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Moon, Sun, User } from 'lucide-react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'

export function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const handleThemeChange = () => {
    toggleTheme()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-white light:text-gray-900 transition-colors duration-300">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 mb-8 text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400 light:text-gray-600">
            Manage your LinkForge account and preferences.
          </p>
        </div>

        <section className="bg-gradient-to-br from-dark-secondary/50 to-dark/30 border border-dark-tertiary/50 light:border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="text-sm text-gray-400 light:text-gray-600">Your signed-in account details</p>
            </div>
          </div>

          <div>
            <label htmlFor="account-email" className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="account-email"
              type="email"
              value={user?.email ?? ''}
              readOnly
              className="w-full px-4 py-3 bg-dark border border-dark-tertiary rounded-lg text-white light:bg-white light:text-gray-900 light:border-gray-300 cursor-not-allowed opacity-80"
            />
          </div>
        </section>

        <section className="bg-gradient-to-br from-dark-secondary/50 to-dark/30 border border-dark-tertiary/50 light:border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Appearance</h2>
              <p className="text-sm text-gray-400 light:text-gray-600">Choose how LinkForge looks for you</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-gray-400 light:text-gray-600">
                Currently using {theme === 'dark' ? 'dark' : 'light'} mode
              </p>
            </div>
            <button
              type="button"
              onClick={handleThemeChange}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white font-medium transition-colors"
            >
              {saved ? <Check size={17} /> : theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              {saved ? 'Saved' : `Use ${theme === 'dark' ? 'light' : 'dark'} mode`}
            </button>
          </div>
        </section>

        <p className="mt-6 text-sm text-gray-500 light:text-gray-600">
          More account and security settings will be added here as they become available.
        </p>
      </main>
    </div>
  )
}
