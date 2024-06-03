export const convertIntlCurrency = (value) => {
  const cleanValue = +value.replace(/\D+/g, '')
  return parseFloat(String(cleanValue)) / 100
}
