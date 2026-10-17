import PropTypes from 'prop-types'
import { labelStatus } from '../../utils/status'
import './BookItem.css'

function BookItem({ buku, onEdit, onHapus }) {
  const handleHapus = () => {
    if (window.confirm(`Hapus buku "${buku.judul}"?`)) {
      onHapus(buku.id)
    }
  }

  return (
    <li className="book-item">
      <div>
        <h3>{buku.judul}</h3>
        <p>{buku.penulis}</p>
        <span className={`status status-${buku.status}`}>{labelStatus(buku.status)}</span>
      </div>
      <div className="aksi">
        <button className="btn" onClick={() => onEdit(buku)}>
          Edit
        </button>
        <button className="btn btn-hapus" onClick={handleHapus}>
          Hapus
        </button>
      </div>
    </li>
  )
}

BookItem.propTypes = {
  buku: PropTypes.shape({
    id: PropTypes.number.isRequired,
    judul: PropTypes.string.isRequired,
    penulis: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onHapus: PropTypes.func.isRequired,
}

export default BookItem
