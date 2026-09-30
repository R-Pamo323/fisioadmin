import type { CSSProperties } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  /** Nombre del paciente; se usa para las iniciales y para elegir el color. */
  name: string
  src?: string
  size?: number
  className?: string
}

/** Washes coherentes con la paleta usada en las tarjetas de servicios. */
const PALETTE = [
  { bg: '#E0F2FE', fg: '#0EA5E9' },
  { bg: '#DCFCE7', fg: '#15803D' },
  { bg: '#DBEAFE', fg: '#1D4ED8' },
  { bg: '#FEF3C7', fg: '#B45309' },
  { bg: '#FCE7F3', fg: '#BE185D' },
] as const

export function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return '?'

  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ''

  return `${first}${last}`.toUpperCase()
}

function pickPaletteColor(name: string): (typeof PALETTE)[number] {
  let hash = 0

  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0
  }

  return PALETTE[hash % PALETTE.length]
}

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  const classes = [styles.avatar, className ?? ''].filter(Boolean).join(' ')
  const boxStyle: CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.max(11, Math.round(size * 0.36)),
  }

  if (src) {
    return (
      <span className={classes} style={boxStyle}>
        <img className={styles.image} src={src} alt={name} />
      </span>
    )
  }

  const { bg, fg } = pickPaletteColor(name)

  return (
    <span
      className={classes}
      style={{ ...boxStyle, background: bg, color: fg }}
      aria-hidden="true"
    >
      {initialsFromName(name)}
    </span>
  )
}