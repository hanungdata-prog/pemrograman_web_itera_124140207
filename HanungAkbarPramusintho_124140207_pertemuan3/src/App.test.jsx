import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('buku baru tampil di daftar dan tersimpan di localStorage', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('Judul'), { target: { value: 'Laut Bercerita' } })
    fireEvent.change(screen.getByLabelText('Penulis'), { target: { value: 'Leila S. Chudori' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))

    expect(screen.getByText('Laut Bercerita')).toBeInTheDocument()

    const dataTersimpan = JSON.parse(localStorage.getItem('data_buku'))
    expect(dataTersimpan[0].judul).toBe('Laut Bercerita')
  })

  test('pencarian hanya menampilkan buku yang cocok', () => {
    localStorage.setItem(
      'data_buku',
      JSON.stringify([
        { id: 1, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', status: 'milik' },
        { id: 2, judul: 'Sapiens', penulis: 'Yuval Noah Harari', status: 'baca' },
      ]),
    )
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('Cari judul atau penulis...'), {
      target: { value: 'harari' },
    })

    expect(screen.getByText('Sapiens')).toBeInTheDocument()
    expect(screen.queryByText('Laskar Pelangi')).not.toBeInTheDocument()
  })
})
