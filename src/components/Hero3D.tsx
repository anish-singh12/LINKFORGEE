import { ArrowRight, BarChart3, Link as LinkIcon, MousePointer2 } from 'lucide-react'

export function Hero3D() {
  return (
    <div className="hero-3d-container">
      <div
        className="relative h-96 w-full overflow-hidden rounded-3xl border border-dark-tertiary/50 bg-dark-secondary/40 light:border-gray-200 light:bg-white/70"
        aria-label="Animated preview of a long URL becoming a short URL"
      >
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="hero-glow hero-glow-top" />
      <div className="hero-glow hero-glow-bottom" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8">
        <div className="hero-link-card hero-link-card-long">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <LinkIcon size={20} />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Long URL</p>
            <p className="truncate text-sm font-medium text-gray-700 light:text-gray-700 dark:text-gray-200">
              example.com/articles/grow-your-business
            </p>
          </div>
        </div>

        <div className="relative flex h-8 w-40 items-center justify-center">
          <div className="hero-flow-line" />
          <div className="hero-flow-dot hero-flow-dot-one" />
          <div className="hero-flow-dot hero-flow-dot-two" />
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/40">
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="hero-link-card hero-link-card-short">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
            <LinkIcon size={20} />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500">Short link</p>
            <p className="truncate text-sm font-semibold text-gray-900 light:text-gray-900 dark:text-white">
              linkforge.app/x7k2
            </p>
          </div>
          <div className="hero-success-dot" />
        </div>
      </div>

      <div className="hero-stat hero-stat-left">
        <MousePointer2 size={15} className="text-blue-500" />
        <span>+24 clicks</span>
      </div>
      <div className="hero-stat hero-stat-right">
        <BarChart3 size={15} className="text-blue-500" />
        <span>Live analytics</span>
      </div>
    </div>
  </div>
  )
}
