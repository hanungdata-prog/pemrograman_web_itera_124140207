import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Navbar.css'

function Navbar({ judul }) {
  return (
    <nav className="navbar">
      <span className="navbar-judul">{judul}</span>
      <div className="navbar-menu">
        <NavLink to="/" end>
          Beranda
        </NavLink>
        <NavLink to="/statistik">Statistik</NavLink>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  judul: PropTypes.string.isRequired,
}

export default Navbar
