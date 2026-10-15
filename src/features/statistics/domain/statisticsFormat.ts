/** Formato de moneda tal como aparece en las estadísticas: "$1,205.00". */
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCurrency = (value: number): string => currencyFormatter.format(value)
