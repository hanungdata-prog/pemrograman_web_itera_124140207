import PropTypes from 'prop-types'
import BookItem from '../BookItem/BookItem'
import './BookList.css'

function BookList({ daftarBuku, onEdit, onHapus }) {
  if (daftarBuku.length === 0) {
    return <p className="list-kosong">Tidak ada buku yang ditemukan.</p>
  }

  return (
    <ul className="book-list">
      {daftarBuku.map((buku) => (
        <BookItem key={buku.id} buku={buku} onEdit={onEdit} onHapus={onHapus} />
      ))}
    </ul>
  )
}

BookList.propTypes = {
  daftarBuku: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onHapus: PropTypes.func.isRequired,
}

export default BookList
