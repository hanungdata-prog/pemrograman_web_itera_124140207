import { render, screen, fireEvent } from '@testing-library/react'
import BookFilter from './BookFilter'

describe('BookFilter', () => {
  test('memanggil onCariChange saat mengetik kata kunci', () => {
    const mockCari = vi.fn()
    render(
      <BookFilter kataKunci="" statusFilter="semua" onCariChange={mockCari} onStatusChange={vi.fn()} />,
    )

    fireEvent.change(screen.getByPlaceholderText('Cari judul atau penulis...'), {
      target: { value: 'andrea' },
    })

    expect(mockCari).toHaveBeenCalledWith('andrea')
  })

  test('memanggil onStatusChange saat status dipilih', () => {
    const mockStatus = vi.fn()
    render(
      <BookFilter kataKunci="" statusFilter="semua" onCariChange={vi.fn()} onStatusChange={mockStatus} />,
    )

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'beli' } })

    expect(mockStatus).toHaveBeenCalledWith('beli')
  })
})
