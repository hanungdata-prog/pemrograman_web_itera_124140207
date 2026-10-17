const formBarang = document.getElementById("form-barang");
const inputNama = document.getElementById("nama-barang");
const inputHarga = document.getElementById("harga-barang");
const inputQty = document.getElementById("qty-barang");
const errorNama = document.getElementById("error-nama");
const errorHarga = document.getElementById("error-harga");
const errorQty = document.getElementById("error-qty");

const isiKeranjang = document.getElementById("isi-keranjang");
const inputPromo = document.getElementById("kode-promo");
const infoPromo = document.getElementById("info-promo");
const teksTotal = document.getElementById("total-belanja");
const teksDiskon = document.getElementById("nominal-diskon");
const keteranganDiskon = document.getElementById("keterangan-diskon");
const teksTotalAkhir = document.getElementById("total-akhir");
const inputBayar = document.getElementById("uang-bayar");
const teksKembalian = document.getElementById("kembalian");
const tombolReset = document.getElementById("tombol-reset");

const MINIMAL_DISKON = 50000;
const PERSEN_DISKON = 10;
const KODE_PROMO = "HEMAT10";

let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function simpanKeranjang() {
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
}

function tampilkanError(input, elemenError, pesan) {
    elemenError.innerText = pesan;
    input.classList.add("input-salah");
}

function hapusError(input, elemenError) {
    elemenError.innerText = "";
    input.classList.remove("input-salah");
}

function validasiForm(nama, harga, qty) {
    let valid = true;

    if (nama === "") {
        tampilkanError(inputNama, errorNama, "Nama barang wajib diisi.");
        valid = false;
    } else if (nama.length < 3) {
        tampilkanError(inputNama, errorNama, "Nama barang minimal 3 karakter.");
        valid = false;
    } else {
        hapusError(inputNama, errorNama);
    }

    if (inputHarga.value === "" || isNaN(harga)) {
        tampilkanError(inputHarga, errorHarga, "Harga wajib diisi dengan angka.");
        valid = false;
    } else if (harga < 500) {
        tampilkanError(inputHarga, errorHarga, "Harga minimal Rp 500.");
        valid = false;
    } else {
        hapusError(inputHarga, errorHarga);
    }

    if (inputQty.value === "" || !Number.isInteger(qty) || qty < 1) {
        tampilkanError(inputQty, errorQty, "Qty harus bilangan bulat minimal 1.");
        valid = false;
    } else {
        hapusError(inputQty, errorQty);
    }

    return valid;
}

function hitungTotal() {
    let total = 0;
    for (let i = 0; i < keranjang.length; i++) {
        total += keranjang[i].harga * keranjang[i].qty;
    }
    return total;
}

function hitungDiskon(total) {
    const kode = inputPromo.value.trim().toUpperCase();

    if (kode !== "" && kode !== KODE_PROMO) {
        infoPromo.innerText = "Kode promo tidak dikenal.";
        infoPromo.className = "pesan-error";
    } else if (kode === KODE_PROMO) {
        infoPromo.innerText = "Kode promo dipakai.";
        infoPromo.className = "pesan-berhasil";
    } else {
        infoPromo.innerText = "";
    }

    if (total === 0) {
        keteranganDiskon.innerText = "";
        return 0;
    }

    if (total >= MINIMAL_DISKON) {
        keteranganDiskon.innerText = `(${PERSEN_DISKON}%, belanja min. ${formatRupiah(MINIMAL_DISKON)})`;
        return total * PERSEN_DISKON / 100;
    }

    if (kode === KODE_PROMO) {
        keteranganDiskon.innerText = `(${PERSEN_DISKON}%, kode ${KODE_PROMO})`;
        return total * PERSEN_DISKON / 100;
    }

    keteranganDiskon.innerText = "";
    return 0;
}

function hitungKembalian(totalAkhir) {
    const uangBayar = parseFloat(inputBayar.value);

    if (inputBayar.value === "" || isNaN(uangBayar)) {
        teksKembalian.innerText = "Kembalian: Rp 0";
        teksKembalian.className = "kembalian";
        return;
    }

    if (uangBayar < totalAkhir) {
        const kurang = totalAkhir - uangBayar;
        teksKembalian.innerText = `Uang belum mencukupi, kurang ${formatRupiah(kurang)}`;
        teksKembalian.className = "kembalian kurang";
    } else {
        const kembalian = uangBayar - totalAkhir;
        teksKembalian.innerText = `Kembalian: ${formatRupiah(kembalian)}`;
        teksKembalian.className = "kembalian cukup";
    }
}

function perbaruiPembayaran() {
    const total = hitungTotal();
    const diskon = hitungDiskon(total);
    const totalAkhir = total - diskon;

    teksTotal.innerText = formatRupiah(total);
    teksDiskon.innerText = "- " + formatRupiah(diskon);
    teksTotalAkhir.innerText = formatRupiah(totalAkhir);

    hitungKembalian(totalAkhir);
}

function tampilkanKeranjang() {
    isiKeranjang.innerHTML = "";

    if (keranjang.length === 0) {
        isiKeranjang.innerHTML = `<tr><td colspan="6" class="kosong">Keranjang masih kosong</td></tr>`;
    }

    keranjang.forEach(function (barang, index) {
        const subtotal = barang.harga * barang.qty;
        isiKeranjang.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${barang.nama}</td>
                <td>${formatRupiah(barang.harga)}</td>
                <td>${barang.qty}</td>
                <td>${formatRupiah(subtotal)}</td>
                <td><button class="tombol tombol-hapus" data-index="${index}">Hapus</button></td>
            </tr>
        `;
    });

    perbaruiPembayaran();
}

formBarang.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const harga = parseFloat(inputHarga.value);
    const qty = Number(inputQty.value);

    if (!validasiForm(nama, harga, qty)) {
        return;
    }

    keranjang.push({ nama: nama, harga: harga, qty: qty });
    simpanKeranjang();
    tampilkanKeranjang();

    formBarang.reset();
    inputNama.focus();
});

isiKeranjang.addEventListener("click", function (event) {
    if (event.target.classList.contains("tombol-hapus")) {
        const index = Number(event.target.dataset.index);
        keranjang.splice(index, 1);
        simpanKeranjang();
        tampilkanKeranjang();
    }
});

inputPromo.addEventListener("input", perbaruiPembayaran);
inputBayar.addEventListener("input", perbaruiPembayaran);

tombolReset.addEventListener("click", function () {
    if (keranjang.length > 0 && !confirm("Kosongkan keranjang dan mulai transaksi baru?")) {
        return;
    }

    keranjang = [];
    localStorage.removeItem("keranjang");
    inputPromo.value = "";
    inputBayar.value = "";
    tampilkanKeranjang();
});

tampilkanKeranjang();
