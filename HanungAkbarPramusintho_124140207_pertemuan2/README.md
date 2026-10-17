# Dashboard Mahasiswa

Tugas Praktikum Pemrograman Aplikasi Web Pertemuan 2 (JavaScript ES6+)

Nama: Hanung Akbar Pramusintho
NIM: 124140207

## Deskripsi

Dashboard pribadi untuk membantu kegiatan kuliah sehari-hari. Masalah yang sering saya alami itu lupa deadline tugas dan lupa ruangan kuliah, jadi dashboard ini fokus ke dua hal itu. Selain itu ada info cuaca di sekitar kampus ITERA (biar tahu perlu bawa payung atau tidak) dan kutipan motivasi.

## Cara Menjalankan

Buka `index.html` di browser. Butuh koneksi internet untuk data cuaca dan kutipan, fitur lain tetap jalan tanpa internet.

## Fitur

- **Jam dan sapaan**: jam real-time dan sapaan menyesuaikan waktu (pagi/siang/sore/malam)
- **Kutipan harian**: diambil dari API DummyJSON, bisa diganti dengan tombol "Kutipan lain"
- **Cuaca ITERA**: suhu, kondisi, dan kecepatan angin dari API Open-Meteo
- **Daftar tugas**
  - Tambah, edit, dan hapus tugas
  - Centang tugas yang sudah selesai
  - Filter semua / belum selesai / selesai
  - Diurutkan berdasarkan deadline, ada keterangan sisa hari (teks kuning kalau mepet, merah kalau terlambat)
- **Jadwal kuliah**
  - Tambah, edit, dan hapus jadwal
  - Diurutkan berdasarkan hari dan jam
  - Jadwal hari ini diberi keterangan "(hari ini)"
- Semua data tugas dan jadwal disimpan di localStorage

## Screenshot

Tampilan dashboard

![Dashboard](screenshot/dashboard.png)

Mode edit tugas

![Edit tugas](screenshot/edit-tugas.png)

Tampilan di HP

![Mobile](screenshot/tampilan-mobile.png)

## Fitur ES6+ yang Dipakai

Semua kode JavaScript ada di `app.js`.

## API yang Dipakai

- Open-Meteo: `https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true`
- DummyJSON Quotes: `https://dummyjson.com/quotes/random`
