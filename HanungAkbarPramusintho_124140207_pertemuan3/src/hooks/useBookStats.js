import { useMemo } from 'react'

function useBookStats(daftarBuku) {
  // dihitung ulang hanya kalau daftarBuku berubah
  const statistik = useMemo(() => {
    const total = daftarBuku.length
    const milik = daftarBuku.filter((buku) => buku.status === 'milik').length
    const baca = daftarBuku.filter((buku) => buku.status === 'baca').length
    const beli = daftarBuku.filter((buku) => buku.status === 'beli').length

    const persen = (jumlah) => (total === 0 ? 0 : Math.round((jumlah / total) * 100))

    return {
      total,
      milik,
      baca,
      beli,
      persenMilik: persen(milik),
      persenBaca: persen(baca),
      persenBeli: persen(beli),
    }
  }, [daftarBuku])

  return statistik
}

export default useBookStats
