import { renderHook } from '@testing-library/react'
import useBookStats from './useBookStats'

describe('useBookStats', () => {
  test('menghitung jumlah buku per status', () => {
    const daftarBuku = [
      { id: 1, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', status: 'milik' },
      { id: 2, judul: 'Bumi Manusia', penulis: 'Pramoedya', status: 'milik' },
      { id: 3, judul: 'Sapiens', penulis: 'Harari', status: 'baca' },
      { id: 4, judul: 'Atomic Habits', penulis: 'James Clear', status: 'beli' },
    ]

    const { result } = renderHook(() => useBookStats(daftarBuku))

    expect(result.current.total).toBe(4)
    expect(result.current.milik).toBe(2)
    expect(result.current.baca).toBe(1)
    expect(result.current.beli).toBe(1)
    expect(result.current.persenMilik).toBe(50)
  })

  test('persentase 0 jika belum ada buku', () => {
    const { result } = renderHook(() => useBookStats([]))
    expect(result.current.total).toBe(0)
    expect(result.current.persenBaca).toBe(0)
  })
})
