import { useState } from 'react'
import PropTypes from 'prop-types'
import { daftarStatus } from '../../utils/status'
import './BookForm.css'

function BookForm({ bukuAwal, onSimpan, onBatal }) {
  const [judul, setJudul] = useState(bukuAwal ? bukuAwal.judul : '')
  const [penulis, setPenulis] = useState(bukuAwal ? bukuAwal.penulis : '')
  const [status, setStatus] = useState(bukuAwal ? bukuAwal.status : 'milik')
  const [error, setError] = useState({})

  const validasi = () => {
    const errorBaru = {}
    if (judul.trim() === '') {
      errorBaru.judul = 'Judul buku wajib diisi'
    }
    if (penulis.trim() === '') {
      errorBaru.penulis = 'Nama penulis wajib diisi'
    }
    setError(errorBaru)
    return Object.keys(errorBaru).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validasi()) return

    onSimpan({ judul: judul.trim(), penulis: penulis.trim(), status })

    if (!bukuAwal) {
      setJudul('')
      setPenulis('')
      setStatus('milik')
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h2>{bukuAwal ? 'Edit Buku' : 'Tambah Buku'}</h2>

      <label htmlFor="judul">Judul</label>
      <input
        id="judul"
        type="text"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        className={error.judul ? 'input-error' : ''}
        placeholder="Judul buku"
      />
      {error.judul && <p className="pesan-error">{error.judul}</p>}

      <label htmlFor="penulis">Penulis</label>
      <input
        id="penulis"
        type="text"
        value={penulis}
        onChange={(e) => setPenulis(e.target.value)}
        className={error.penulis ? 'input-error' : ''}
        placeholder="Nama penulis"
      />
      {error.penulis && <p className="pesan-error">{error.penulis}</p>}

      <label htmlFor="status">Status</label>
      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
        {daftarStatus.map((item) => (
          <option key={item.nilai} value={item.nilai}>
            {item.label}
          </option>
        ))}
      </select>

      <div className="tombol-form">
        <button type="submit" className="btn btn-utama">
          {bukuAwal ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {onBatal && (
          <button type="button" className="btn" onClick={onBatal}>
            Batal
          </button>
        )}
      </div>
    </form>
  )
}

BookForm.propTypes = {
  bukuAwal: PropTypes.shape({
    judul: PropTypes.string,
    penulis: PropTypes.string,
    status: PropTypes.string,
  }),
  onSimpan: PropTypes.func.isRequired,
  onBatal: PropTypes.func,
}

export default BookForm
