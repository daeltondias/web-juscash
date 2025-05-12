export const formatCurrency = (value?: number, emptyValue: string = '--') => {
  if (typeof value !== 'number') return emptyValue
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
