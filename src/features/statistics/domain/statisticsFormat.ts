/** Formato de moneda en soles: "S/1,205.00". */
const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCurrency = (value: number): string => `S/${amountFormatter.format(value)}`
