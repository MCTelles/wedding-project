import { generateColorVariations } from '@/utils/colour'
import { PaletteOptions } from '@mui/material'
import colourConfig from '../colour.config'

const primaryPalette = generateColorVariations(colourConfig.primary)
const secondaryPalette = generateColorVariations(colourConfig.secondary)

// https://coolors.co/cc9c00-85c190-44884e-1b361f-ce6950-723120-30140d
const paletteBase: Partial<PaletteOptions> = {
  // If you want more control over your colours uncomment this section

  // primary: {
  //   light: '#a1a892', // Um sálvia mais claro para hover e fundos sutis
  //   main: '#788067', // Sua cor base (Sálvia/Oliva)
  //   dark: '#4c5340', // Um tom mais profundo para textos e botões destacados
  //   contrastText: '#fbfbfb',
  // },
  // secondary: {
  //   light: '#e2e5d8', // Tom de areia/creme para contrastar suavemente
  //   main: '#a6ad94', // Uma variação mais desaturada
  //   dark: '#5e654f', // Tom de floresta fechada
  //   contrastText: '#1B361F', // Texto escuro para melhor legibilidade no secundário claro
  // },

  // If you want more control over your colours comment these 2 lines out
  primary: primaryPalette,
  secondary: secondaryPalette,
}

export default paletteBase
