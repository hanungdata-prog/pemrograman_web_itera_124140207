import { useState, useEffect } from 'react'
import BookForm from '../../components/BookForm/BookForm'
import BookFilter from '../../components/BookFilter/BookFilter'
import BookList from '../../components/BookList/BookList'
import { useBuku } from '../../context/BookContext'
import './Home.css'

function Home() {
  const { daftarBuku, tambahBuku, ubahBuku, hapusBuku } = useBuku()
  const [kataKunci, setKataKunci] = useState('')
  const [statusFilter, setStatusFilter] = useState('semua')
  const [bukuDiedit, setBukuDiedit] = useState(null)

  useEffect(() => {
    document.title = `Manajemen Buku (${daftarBuku.length})`
  }, [daftarBuku])

  const handleSimpan = (dataBuku) => {
    if (bukuDiedit) {
      ubahBuku(bukuDiedit.id, dataBuku)
      setBukuDiedit(null)
    } else {
      tambahBuku(dataBuku)
    }
  }

  const handleHapus = (id) => {
    hapusBuku(id)
    if (bukuDiedit && bukuDiedit.id === id) {
      setBukuDiedit(null)
    }
  }

  // filter berdasarkan status dulu, lalu cocokkan kata kunci ke judul atau penulis
  const bukuTampil = daftarBuku.filter((buku) => {
    const cocokStatus = statusFilter === 'semua' || buku.status === statusFilter
    const kata = kataKunci.toLowerCase()
    const cocokKata =
      buku.judul.toLowerCase().includes(kata) || buku.penulis.toLowerCase().includes(kata)
    return cocokStatus && cocokKata
  })

  return (
    <div className="home">
      <section className="kotak">
        {/* key dipakai supaya form ter-reset saat ganti buku yang diedit */}
        <BookForm
          key={bukuDiedit ? bukuDiedit.id : 'baru'}
          bukuAwal={bukuDiedit}
          onSimpan={handleSimpan}
          onBatal={bukuDiedit ? () => setBukuDiedit(null) : undefined}
        />
      </section>

      <section className="kotak">
        <h2>Koleksi Buku ({daftarBuku.length})</h2>
        <BookFilter
          kataKunci={kataKunci}
          statusFilter={statusFilter}
          onCariChange={setKataKunci}
          onStatusChange={setStatusFilter}
        />
        <BookList daftarBuku={bukuTampil} onEdit={setBukuDiedit} onHapus={handleHapus} />
      </section>
    </div>
  )
}

export default Home
