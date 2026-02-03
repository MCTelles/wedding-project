import { ColourPalette } from '@/interfaces/colour'

const adjustColorBrightness = (hex: string, percent: number): string => {
  const cleanHex = hex.replace('#', '')
  const num = parseInt(cleanHex, 16)

  let r = (num >> 16) + percent
  let g = ((num >> 8) & 0x00ff) + percent
  let b = (num & 0x0000ff) + percent

  const getHex = (value: number) => {
    const clamped = Math.max(0, Math.min(255, value))
    return clamped.toString(16).padStart(2, '0')
  }

  return `#${getHex(r)}${getHex(g)}${getHex(b)}`.toUpperCase()
}

function getContrastTextColor(hex: string): string {
  const cleanHex = hex.replace('#', '')
  const num = parseInt(cleanHex, 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  return luminance > 150 ? '#1B361F' : '#FBFBFB'
}

export const generateColorVariations = (hex: string): ColourPalette => {
  const light = adjustColorBrightness(hex, 40)
  const dark = adjustColorBrightness(hex, -60)
  const textContrast = getContrastTextColor(hex)

  return {
    light,
    main: hex.startsWith('#') ? hex : `#${hex}`,
    dark,
    contrastText: textContrast,
  }
}
