import { render, screen, fireEvent } from '@testing-library/react'
import BookItem from './BookItem'

const buku = { id: 1, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', status: 'milik' }

describe('BookItem', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('menampilkan judul, penulis, dan status buku', () => {
    render(<BookItem buku={buku} onEdit={vi.fn()} onHapus={vi.fn()} />)

    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
    expect(screen.getByText('Andrea Hirata')).toBeInTheDocument()
    expect(screen.getByText('Dimiliki')).toBeInTheDocument()
  })

  test('memanggil onHapus dengan id buku setelah dikonfirmasi', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const mockHapus = vi.fn()
    render(<BookItem buku={buku} onEdit={vi.fn()} onHapus={mockHapus} />)

    fireEvent.click(screen.getByText('Hapus'))

    expect(mockHapus).toHaveBeenCalledWith(1)
  })

  test('tidak menghapus jika konfirmasi dibatalkan', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const mockHapus = vi.fn()
    render(<BookItem buku={buku} onEdit={vi.fn()} onHapus={mockHapus} />)

    fireEvent.click(screen.getByText('Hapus'))

    expect(mockHapus).not.toHaveBeenCalled()
  })
})
