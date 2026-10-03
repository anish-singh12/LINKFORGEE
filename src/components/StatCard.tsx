/**
 * Premium Statistic Cards
 * Animated statistics with hover effects and glass morphism
 */

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

export function StatCard({ title, value, icon: Icon, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-dark-tertiary/50 light:border-slate-200/90 bg-gradient-to-br from-dark-secondary/80 via-dark/50 to-dark-secondary/30 light:from-white light:via-white light:to-slate-50/70 light:bg-white p-6 backdrop-blur-xl light:backdrop-blur-none hover:border-accent/30 light:hover:border-accent/40 transition-all duration-300 shadow-lg light:shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-accent/10 light:hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)]"
    >
      {/* Gradient Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent light:from-blue-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 light:text-slate-500 uppercase tracking-wider mb-1.5">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">{value}</span>
              {trend && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                  className={`text-xs font-medium ${trend.isPositive ? 'text-green-400 light:text-emerald-600' : 'text-red-400 light:text-rose-600'}`}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </motion.span>
              )}
            </div>
          </div>

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="p-3 rounded-xl bg-accent/10 light:bg-blue-50 group-hover:bg-accent/20 light:group-hover:bg-blue-100 transition-colors"
          >
            <Icon size={22} className="text-accent light:text-blue-600" />
          </motion.div>
        </div>

        {/* Bottom Indicator */}
        <div className="h-1.5 bg-dark light:bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: delay + 0.2 }}
            className="h-full bg-gradient-to-r from-accent to-accent-light"
          />
        </div>
      </div>

      {/* Floating accent corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 light:bg-blue-500/5 rounded-full -mr-10 -mt-10 group-hover:bg-accent/10 transition-all duration-300" />
    </motion.div>
  )
}

interface StatGridProps {
  stats: Array<{
    title: string
    value: string | number
    icon: LucideIcon
    trend?: { value: number; isPositive: boolean }
  }>
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} delay={idx * 0.1} />
      ))}
    </div>
  )
}
