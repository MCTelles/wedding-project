import weddingConfig from '@/config/wedding.config'

export const getWeddingDate = (): Date => {
  const dateStr = weddingConfig.date.time
    ? weddingConfig.date.date + 'T' + weddingConfig.date.time
    : weddingConfig.date.date

  return new Date(dateStr)
}

export const formatDate = (date: Date): string => {
  const day = date.getDate()
  const dayFormatted = day === 1 ? '1º' : day

  const month = date.toLocaleString('pt-BR', { month: 'long' })

  return `${dayFormatted} de ${month} de ${date.getFullYear()}`
}

const getOrdinalSuffixPT = (day: number): string => {
  return day === 1 ? 'º' : ''
}
