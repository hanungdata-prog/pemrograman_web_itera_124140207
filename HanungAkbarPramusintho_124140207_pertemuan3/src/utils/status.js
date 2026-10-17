export const daftarStatus = [
  { nilai: 'milik', label: 'Dimiliki' },
  { nilai: 'baca', label: 'Sedang Dibaca' },
  { nilai: 'beli', label: 'Ingin Dibeli' },
]

export function labelStatus(nilai) {
  const status = daftarStatus.find((item) => item.nilai === nilai)
  return status ? status.label : nilai
}
