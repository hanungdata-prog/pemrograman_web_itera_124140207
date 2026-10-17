import PropTypes from 'prop-types'
import { daftarStatus } from '../../utils/status'
import './BookFilter.css'

function BookFilter({ kataKunci, statusFilter, onCariChange, onStatusChange }) {
  return (
    <div className="book-filter">
      <input
        type="text"
        placeholder="Cari judul atau penulis..."
        value={kataKunci}
        onChange={(e) => onCariChange(e.target.value)}
      />
      <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="semua">Semua Status</option>
        {daftarStatus.map((item) => (
          <option key={item.nilai} value={item.nilai}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}

BookFilter.propTypes = {
  kataKunci: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onCariChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
}

export default BookFilter
