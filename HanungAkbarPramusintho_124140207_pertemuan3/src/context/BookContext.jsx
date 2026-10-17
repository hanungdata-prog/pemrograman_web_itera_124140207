import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '../hooks/useLocalStorage'

const BookContext = createContext()

export function BookProvider({ children }) {
  const [daftarBuku, setDaftarBuku] = useLocalStorage('data_buku', [])

  const tambahBuku = (bukuBaru) => {
    setDaftarBuku([...daftarBuku, { ...bukuBaru, id: Date.now() }])
  }

  const ubahBuku = (id, dataBaru) => {
    setDaftarBuku(daftarBuku.map((buku) => (buku.id === id ? { ...buku, ...dataBaru } : buku)))
  }

  const hapusBuku = (id) => {
    setDaftarBuku(daftarBuku.filter((buku) => buku.id !== id))
  }

  return (
    <BookContext.Provider value={{ daftarBuku, tambahBuku, ubahBuku, hapusBuku }}>
      {children}
    </BookContext.Provider>
  )
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useBuku() {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error('useBuku harus dipakai di dalam BookProvider')
  }
  return context
}
