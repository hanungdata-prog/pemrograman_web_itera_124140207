import { render, screen, fireEvent } from '@testing-library/react'
import BookForm from './BookForm'

describe('BookForm', () => {
  test('menampilkan pesan error jika judul dan penulis kosong', () => {
    const mockSimpan = vi.fn()
    render(<BookForm onSimpan={mockSimpan} />)

    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))

    expect(screen.getByText('Judul buku wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Nama penulis wajib diisi')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveClass('input-error')
    expect(mockSimpan).not.toHaveBeenCalled()
  })

  test('memanggil onSimpan jika data sudah benar', () => {
    const mockSimpan = vi.fn()
    render(<BookForm onSimpan={mockSimpan} />)

    fireEvent.change(screen.getByLabelText('Judul'), { target: { value: 'Laskar Pelangi' } })
    fireEvent.change(screen.getByLabelText('Penulis'), { target: { value: 'Andrea Hirata' } })
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'baca' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))

    expect(mockSimpan).toHaveBeenCalledWith({
      judul: 'Laskar Pelangi',
      penulis: 'Andrea Hirata',
      status: 'baca',
    })
  })

  test('mengisi form dengan data buku saat mode edit', () => {
    const buku = { id: 1, judul: 'Bumi Manusia', penulis: 'Pramoedya', status: 'beli' }
    render(<BookForm bukuAwal={buku} onSimpan={vi.fn()} onBatal={vi.fn()} />)

    expect(screen.getByLabelText('Judul')).toHaveValue('Bumi Manusia')
    expect(screen.getByLabelText('Penulis')).toHaveValue('Pramoedya')
    expect(screen.getByRole('button', { name: 'Simpan Perubahan' })).toBeInTheDocument()
  })
})
