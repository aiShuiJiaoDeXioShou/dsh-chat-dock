import * as React from 'react'

export interface GlyphProps {
  size?: number
  className?: string
}

function svgProps(size: number, className?: string): React.SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false,
    className,
  }
}

export function ChatGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M4 5.5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
      <path d="M8 11h.01M12 11h.01M16 11h.01" strokeWidth={2.4} />
    </svg>
  )
}

export function GearGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v2M12 19.2v2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M2.8 12h2M19.2 12h2M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5" />
    </svg>
  )
}

export function CopyGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  )
}

export function InsertGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M12 3v10" />
      <path d="m8 9 4 4 4-4" />
      <path d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3" />
    </svg>
  )
}

export function FloatGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="3" y="7" width="12" height="12" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" />
      <path d="M15 3v6h6" />
    </svg>
  )
}

export function CloseGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function CollapseGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function RefreshGlyph({ size = 16, className }: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v6h-6" />
    </svg>
  )
}
