const KUNCI_TUGAS = "dashboard_tugas";
const KUNCI_JADWAL = "dashboard_jadwal";
const URL_CUACA = "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true";
const URL_KUTIPAN = "https://dummyjson.com/quotes/random";
const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const formatTanggal = (tanggal) =>
    new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const duaDigit = (angka) => String(angka).padStart(2, "0");

const keteranganCuaca = (kode) => {
    if (kode === 0) return "Cerah";
    if (kode <= 3) return "Berawan";
    if (kode <= 48) return "Berkabut";
    if (kode <= 67) return "Hujan";
    if (kode <= 82) return "Hujan lebat";
    return "Badai petir";
};

class TaskItem {
    constructor({ id = Date.now(), judul, matkul, deadline, selesai = false }) {
        this.id = id;
        this.judul = judul;
        this.matkul = matkul;
        this.deadline = deadline;
        this.selesai = selesai;
    }

    sisaHari() {
        const hariIni = new Date();
        hariIni.setHours(0, 0, 0, 0);
        const batas = new Date(this.deadline);
        batas.setHours(0, 0, 0, 0);
        return Math.round((batas - hariIni) / (1000 * 60 * 60 * 24));
    }

    labelDeadline() {
        if (this.selesai) return "Selesai";

        const sisa = this.sisaHari();
        if (sisa < 0) return `Terlambat ${Math.abs(sisa)} hari`;
        if (sisa === 0) return "Hari ini";
        if (sisa === 1) return "Besok";
        return `${sisa} hari lagi`;
    }
}

class JadwalItem {
    constructor({ id = Date.now(), matkul, hari, jam, ruang }) {
        this.id = id;
        this.matkul = matkul;
        this.hari = hari;
        this.jam = jam;
        this.ruang = ruang;
    }
}

class DashboardApp {
    constructor() {
        this.daftarTugas = this.ambilData(KUNCI_TUGAS).map((data) => new TaskItem(data));
        this.daftarJadwal = this.ambilData(KUNCI_JADWAL).map((data) => new JadwalItem(data));
        this.filter = "semua";
        this.idTugasDiedit = null;
        this.idJadwalDiedit = null;
    }

    ambilData(kunci) {
        const data = localStorage.getItem(kunci);
        return data ? JSON.parse(data) : [];
    }

    simpanData(kunci, data) {
        localStorage.setItem(kunci, JSON.stringify(data));
    }

    tambahTugas(dataTugas) {
        this.daftarTugas = [...this.daftarTugas, new TaskItem(dataTugas)];
        this.simpanData(KUNCI_TUGAS, this.daftarTugas);
    }

    ubahTugas(id, dataBaru) {
        this.daftarTugas = this.daftarTugas.map((tugas) =>
            tugas.id === id ? new TaskItem({ ...tugas, ...dataBaru }) : tugas
        );
        this.simpanData(KUNCI_TUGAS, this.daftarTugas);
    }

    hapusTugas(id) {
        this.daftarTugas = this.daftarTugas.filter((tugas) => tugas.id !== id);
        this.simpanData(KUNCI_TUGAS, this.daftarTugas);
    }

    tandaiSelesai(id) {
        const tugas = this.daftarTugas.find((item) => item.id === id);
        this.ubahTugas(id, { selesai: !tugas.selesai });
    }

    tambahJadwal(dataJadwal) {
        this.daftarJadwal = [...this.daftarJadwal, new JadwalItem(dataJadwal)];
        this.simpanData(KUNCI_JADWAL, this.daftarJadwal);
    }

    ubahJadwal(id, dataBaru) {
        this.daftarJadwal = this.daftarJadwal.map((jadwal) =>
            jadwal.id === id ? new JadwalItem({ ...jadwal, ...dataBaru }) : jadwal
        );
        this.simpanData(KUNCI_JADWAL, this.daftarJadwal);
    }

    hapusJadwal(id) {
        this.daftarJadwal = this.daftarJadwal.filter((jadwal) => jadwal.id !== id);
        this.simpanData(KUNCI_JADWAL, this.daftarJadwal);
    }

    tugasTampil() {
        let hasil = [...this.daftarTugas];

        if (this.filter === "belum") {
            hasil = hasil.filter((tugas) => !tugas.selesai);
        } else if (this.filter === "selesai") {
            hasil = hasil.filter((tugas) => tugas.selesai);
        }

        return hasil.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    jadwalUrut() {
        return [...this.daftarJadwal].sort((a, b) => {
            const selisihHari = NAMA_HARI.indexOf(a.hari) - NAMA_HARI.indexOf(b.hari);
            return selisihHari !== 0 ? selisihHari : a.jam.localeCompare(b.jam);
        });
    }

    async ambilCuaca() {
        try {
            const response = await fetch(URL_CUACA);
            if (!response.ok) throw new Error(`Status ${response.status}`);

            const data = await response.json();
            const { temperature, windspeed, weathercode } = data.current_weather;
            return { suhu: temperature, angin: windspeed, kondisi: keteranganCuaca(weathercode) };
        } catch (error) {
            console.error("Gagal mengambil cuaca:", error);
            return null;
        }
    }

    async ambilKutipan() {
        try {
            const response = await fetch(URL_KUTIPAN);
            if (!response.ok) throw new Error(`Status ${response.status}`);

            const { quote, author } = await response.json();
            return { isi: quote, penulis: author };
        } catch (error) {
            console.error("Gagal mengambil kutipan:", error);
            return { isi: "Sedikit demi sedikit, lama-lama menjadi bukit.", penulis: "Pepatah" };
        }
    }
}

const app = new DashboardApp();

const formTugas = document.getElementById("form-tugas");
const inputJudulTugas = document.getElementById("judul-tugas");
const inputMatkulTugas = document.getElementById("matkul-tugas");
const inputDeadline = document.getElementById("deadline-tugas");
const errorTugas = document.getElementById("error-tugas");
const tombolSimpanTugas = document.getElementById("tombol-simpan-tugas");
const tombolBatalTugas = document.getElementById("tombol-batal-tugas");
const daftarTugasEl = document.getElementById("daftar-tugas");
const infoTugas = document.getElementById("info-tugas");
const filterTugas = document.getElementById("filter-tugas");

const formJadwal = document.getElementById("form-jadwal");
const inputMatkulJadwal = document.getElementById("matkul-jadwal");
const inputHari = document.getElementById("hari-jadwal");
const inputJam = document.getElementById("jam-jadwal");
const inputRuang = document.getElementById("ruang-jadwal");
const errorJadwal = document.getElementById("error-jadwal");
const tombolSimpanJadwal = document.getElementById("tombol-simpan-jadwal");
const tombolBatalJadwal = document.getElementById("tombol-batal-jadwal");
const daftarJadwalEl = document.getElementById("daftar-jadwal");

function tampilkanTugas() {
    const tugasTampil = app.tugasTampil();
    const jumlahBelum = app.daftarTugas.filter((tugas) => !tugas.selesai).length;

    infoTugas.innerText = `${jumlahBelum} tugas belum selesai dari ${app.daftarTugas.length} tugas`;

    if (tugasTampil.length === 0) {
        daftarTugasEl.innerHTML = `<li class="kosong">Tidak ada tugas di sini.</li>`;
        return;
    }

    daftarTugasEl.innerHTML = tugasTampil
        .map((tugas) => {
            const sisa = tugas.sisaHari();
            let kelasDeadline = "";
            if (!tugas.selesai && sisa < 0) kelasDeadline = "lewat";
            else if (!tugas.selesai && sisa <= 2) kelasDeadline = "dekat";

            return `
                <li class="item ${tugas.selesai ? "selesai" : ""}">
                    <input type="checkbox" data-aksi="selesai" data-id="${tugas.id}" ${tugas.selesai ? "checked" : ""}>
                    <div class="item-isi">
                        <strong>${tugas.judul}</strong>
                        <span>${tugas.matkul} &middot; ${formatTanggal(tugas.deadline)}</span>
                        <small class="sisa-waktu ${kelasDeadline}">${tugas.labelDeadline()}</small>
                    </div>
                    <button class="tombol-teks" data-aksi="edit" data-id="${tugas.id}">Edit</button>
                    <button class="tombol-teks merah" data-aksi="hapus" data-id="${tugas.id}">Hapus</button>
                </li>
            `;
        })
        .join("");
}

function tampilkanJadwal() {
    const hariIni = NAMA_HARI[new Date().getDay()];
    const jadwal = app.jadwalUrut();

    if (jadwal.length === 0) {
        daftarJadwalEl.innerHTML = `<li class="kosong">Belum ada jadwal kuliah.</li>`;
        return;
    }

    daftarJadwalEl.innerHTML = jadwal
        .map(({ id, matkul, hari, jam, ruang }) => `
            <li class="item ${hari === hariIni ? "hari-ini" : ""}">
                <div class="item-isi">
                    <strong>${matkul}</strong>
                    <span>${hari}, ${jam} &middot; ${ruang} ${hari === hariIni ? "(hari ini)" : ""}</span>
                </div>
                <button class="tombol-teks" data-aksi="edit" data-id="${id}">Edit</button>
                <button class="tombol-teks merah" data-aksi="hapus" data-id="${id}">Hapus</button>
            </li>
        `)
        .join("");
}

function resetFormTugas() {
    formTugas.reset();
    app.idTugasDiedit = null;
    tombolSimpanTugas.innerText = "Tambah Tugas";
    tombolBatalTugas.hidden = true;
    errorTugas.innerText = "";
}

function resetFormJadwal() {
    formJadwal.reset();
    app.idJadwalDiedit = null;
    tombolSimpanJadwal.innerText = "Tambah Jadwal";
    tombolBatalJadwal.hidden = true;
    errorJadwal.innerText = "";
}

formTugas.addEventListener("submit", (event) => {
    event.preventDefault();

    const judul = inputJudulTugas.value.trim();
    const matkul = inputMatkulTugas.value.trim();
    const deadline = inputDeadline.value;

    if (judul === "" || matkul === "" || deadline === "") {
        errorTugas.innerText = "Nama tugas, mata kuliah, dan deadline wajib diisi.";
        return;
    }

    if (app.idTugasDiedit) {
        app.ubahTugas(app.idTugasDiedit, { judul, matkul, deadline });
    } else {
        app.tambahTugas({ judul, matkul, deadline });
    }

    resetFormTugas();
    tampilkanTugas();
});

tombolBatalTugas.addEventListener("click", resetFormTugas);

daftarTugasEl.addEventListener("click", (event) => {
    const { aksi, id } = event.target.dataset;
    if (!aksi) return;

    const idTugas = Number(id);

    if (aksi === "selesai") {
        app.tandaiSelesai(idTugas);
    } else if (aksi === "hapus") {
        if (!confirm("Hapus tugas ini?")) return;
        app.hapusTugas(idTugas);
        if (app.idTugasDiedit === idTugas) resetFormTugas();
    } else if (aksi === "edit") {
        const tugas = app.daftarTugas.find((item) => item.id === idTugas);
        inputJudulTugas.value = tugas.judul;
        inputMatkulTugas.value = tugas.matkul;
        inputDeadline.value = tugas.deadline;
        app.idTugasDiedit = idTugas;
        tombolSimpanTugas.innerText = "Simpan Perubahan";
        tombolBatalTugas.hidden = false;
        inputJudulTugas.focus();
    }

    tampilkanTugas();
});

filterTugas.addEventListener("click", (event) => {
    const pilihan = event.target.dataset.filter;
    if (!pilihan) return;

    app.filter = pilihan;
    for (const tombol of filterTugas.children) {
        tombol.classList.toggle("aktif", tombol.dataset.filter === pilihan);
    }
    tampilkanTugas();
});

formJadwal.addEventListener("submit", (event) => {
    event.preventDefault();

    const matkul = inputMatkulJadwal.value.trim();
    const hari = inputHari.value;
    const jam = inputJam.value;
    const ruang = inputRuang.value.trim();

    if (matkul === "" || hari === "" || jam === "" || ruang === "") {
        errorJadwal.innerText = "Semua kolom jadwal wajib diisi.";
        return;
    }

    if (app.idJadwalDiedit) {
        app.ubahJadwal(app.idJadwalDiedit, { matkul, hari, jam, ruang });
    } else {
        app.tambahJadwal({ matkul, hari, jam, ruang });
    }

    resetFormJadwal();
    tampilkanJadwal();
});

tombolBatalJadwal.addEventListener("click", resetFormJadwal);

daftarJadwalEl.addEventListener("click", (event) => {
    const { aksi, id } = event.target.dataset;
    if (!aksi) return;

    const idJadwal = Number(id);

    if (aksi === "hapus") {
        if (!confirm("Hapus jadwal ini?")) return;
        app.hapusJadwal(idJadwal);
        if (app.idJadwalDiedit === idJadwal) resetFormJadwal();
    } else if (aksi === "edit") {
        const jadwal = app.daftarJadwal.find((item) => item.id === idJadwal);
        inputMatkulJadwal.value = jadwal.matkul;
        inputHari.value = jadwal.hari;
        inputJam.value = jadwal.jam;
        inputRuang.value = jadwal.ruang;
        app.idJadwalDiedit = idJadwal;
        tombolSimpanJadwal.innerText = "Simpan Perubahan";
        tombolBatalJadwal.hidden = false;
    }

    tampilkanJadwal();
});

function perbaruiJam() {
    const sekarang = new Date();
    const jam = sekarang.getHours();

    let sapaan = "Selamat malam";
    if (jam >= 4 && jam < 11) sapaan = "Selamat pagi";
    else if (jam >= 11 && jam < 15) sapaan = "Selamat siang";
    else if (jam >= 15 && jam < 18) sapaan = "Selamat sore";

    document.getElementById("sapaan").innerText = `${sapaan}, Hanung!`;
    document.getElementById("jam").innerText =
        `${duaDigit(jam)}:${duaDigit(sekarang.getMinutes())}:${duaDigit(sekarang.getSeconds())}`;
    document.getElementById("tanggal-hari-ini").innerText = sekarang.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

async function tampilkanCuaca() {
    const isiCuaca = document.getElementById("isi-cuaca");
    const cuaca = await app.ambilCuaca();

    if (!cuaca) {
        isiCuaca.innerHTML = `<p class="pesan-error">Data cuaca tidak bisa dimuat. Cek koneksi internet.</p>`;
        return;
    }

    const { suhu, angin, kondisi } = cuaca;
    isiCuaca.innerHTML = `
        <p class="suhu">${suhu}&deg;C</p>
        <p class="kondisi">${kondisi}</p>
        <p class="detail">Angin ${angin} km/jam &middot; Way Huwi, Lampung Selatan</p>
    `;
}

async function tampilkanKutipan() {
    document.getElementById("isi-kutipan").innerText = "Memuat kutipan...";
    const { isi, penulis } = await app.ambilKutipan();
    document.getElementById("isi-kutipan").innerText = `"${isi}"`;
    document.getElementById("penulis-kutipan").innerText = `- ${penulis}`;
}

document.getElementById("tombol-kutipan").addEventListener("click", tampilkanKutipan);

perbaruiJam();
setInterval(perbaruiJam, 1000);
tampilkanTugas();
tampilkanJadwal();
tampilkanCuaca();
tampilkanKutipan();
