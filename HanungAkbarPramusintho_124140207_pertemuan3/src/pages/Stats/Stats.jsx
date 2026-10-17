import { useBuku } from '../../context/BookContext'
import useBookStats from '../../hooks/useBookStats'
import './Stats.css'

function Stats() {
  const { daftarBuku } = useBuku()
  const statistik = useBookStats(daftarBuku)

  const dataStatus = [
    { label: 'Dimiliki', jumlah: statistik.milik, persen: statistik.persenMilik, kelas: 'milik' },
    { label: 'Sedang Dibaca', jumlah: statistik.baca, persen: statistik.persenBaca, kelas: 'baca' },
    { label: 'Ingin Dibeli', jumlah: statistik.beli, persen: statistik.persenBeli, kelas: 'beli' },
  ]

  return (
    <div className="stats">
      <h2>Statistik Koleksi</h2>

      <div className="stats-kartu">
        <div className="kotak">
          <p className="angka">{statistik.total}</p>
          <p>Total Buku</p>
        </div>
        {dataStatus.map((item) => (
          <div className="kotak" key={item.kelas}>
            <p className="angka">{item.jumlah}</p>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      <div className="kotak">
        <h3>Persentase</h3>
        {dataStatus.map((item) => (
          <div className="baris-persen" key={item.kelas}>
            <span>
              {item.label} ({item.persen}%)
            </span>
            <div className="bar">
              <div className={`bar-isi bar-${item.kelas}`} style={{ width: `${item.persen}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
