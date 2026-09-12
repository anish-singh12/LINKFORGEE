interface BrandLogoProps {
  compact?: boolean
  className?: string
}

export function BrandLogo({ compact = false, className = '' }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-label="LinkForge">
      <svg className="brand-logo__mark" viewBox="0 0 40 40" role="img" aria-hidden="true">
        <path
          d="M8 12.5h9.5a6.5 6.5 0 0 1 0 13H12a4 4 0 0 1 0-8h5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
        />
        <path
          d="M32 27.5h-9.5a6.5 6.5 0 0 1 0-13H28a4 4 0 0 1 0 8h-5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
        />
        <path d="M20 18h4v4h-4z" fill="#f29a38" />
      </svg>
      {!compact && <span className="brand-logo__wordmark">Link<span>Forge</span></span>}
    </span>
  )
}
