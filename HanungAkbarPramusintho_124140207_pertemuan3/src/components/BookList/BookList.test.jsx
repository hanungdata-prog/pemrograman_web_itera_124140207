import { render, screen } from '@testing-library/react'
import BookList from './BookList'

describe('BookList', () => {
  test('menampilkan pesan jika daftar buku kosong', () => {
    render(<BookList daftarBuku={[]} onEdit={vi.fn()} onHapus={vi.fn()} />)
    expect(screen.getByText('Tidak ada buku yang ditemukan.')).toBeInTheDocument()
  })

  test('menampilkan semua buku di dalam daftar', () => {
    const daftarBuku = [
      { id: 1, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', status: 'milik' },
      { id: 2, judul: 'Sapiens', penulis: 'Yuval Noah Harari', status: 'baca' },
    ]
    render(<BookList daftarBuku={daftarBuku} onEdit={vi.fn()} onHapus={vi.fn()} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Sapiens')).toBeInTheDocument()
  })
})
