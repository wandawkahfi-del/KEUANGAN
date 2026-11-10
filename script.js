
document.addEventListener("DOMContentLoaded", function () {

    // MENGAMBIL TOMBOL
    const tombolHitung = document.getElementById("hitungBtn");
    const tombolReset = document.getElementById("resetBtn");
    const tombolCetak = document.getElementById("cetakBtn");

    // FORMAT RUPIAH
    function formatRupiah(angka) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(angka);
    }

    // MENGAMBIL DATA FORMULIR
    function ambilData() {
        return {
            nama: document.getElementById("nama").value.trim(),
            nim: document.getElementById("nim").value.trim(),
            prodi: document.getElementById("prodi").value.trim(),

            dasar: Number(document.getElementById("biayaKuliah").value),
            sks: Number(document.getElementById("jumlahSKS").value),
            tarif: Number(document.getElementById("tarifSKS").value),
            tambahan: Number(document.getElementById("biayaTambahan").value)
        };
    }

    // VALIDASI DATA
    function validasiData(data) {

        if (!data.nama || !data.nim || !data.prodi) {
            alert("Mohon lengkapi nama, NIM, dan program studi.");
            return false;
        }

        const kolomAngka = [
            "biayaKuliah",
            "jumlahSKS",
            "tarifSKS",
            "biayaTambahan"
        ];

        for (let id of kolomAngka) {
            const nilai = document.getElementById(id).value;

            if (nilai === "") {
                alert("Mohon lengkapi semua rincian biaya.");
                document.getElementById(id).focus();
                return false;
            }

            if (!Number.isFinite(Number(nilai)) || Number(nilai) < 0) {
                alert("Nilai biaya tidak boleh negatif atau tidak valid.");
                document.getElementById(id).focus();
                return false;
            }
        }

        if (!Number.isInteger(data.sks)) {
            alert("Jumlah SKS harus berupa bilangan bulat.");
            document.getElementById("jumlahSKS").focus();
            return false;
        }

        return true;
    }

    // MENGHITUNG TOTAL PEMBAYARAN
    function hitungTotal(data) {

        const totalSKS = data.sks * data.tarif;

        const total =
            data.dasar +
            totalSKS +
            data.tambahan;

        return {
            totalSKS: totalSKS,
            total: total
        };
    }

    // MEMPERBARUI HASIL DI HALAMAN
    function tampilkanHasil(data, hasil) {

        document.getElementById("hasilDasar").textContent =
            formatRupiah(data.dasar);

        document.getElementById("hasilSKS").textContent =
            formatRupiah(hasil.totalSKS);

        document.getElementById("hasilTambahan").textContent =
            formatRupiah(data.tambahan);

        document.getElementById("hasilTotal").textContent =
            formatRupiah(hasil.total);
    }

    // MEMPERBARUI LAPORAN CETAK
    function perbaruiLaporan(data, hasil) {

        document.getElementById("cetakNama").textContent = data.nama;
        document.getElementById("cetakNim").textContent = data.nim;
        document.getElementById("cetakProdi").textContent = data.prodi;

        document.getElementById("cetakDasar").textContent =
            formatRupiah(data.dasar);

        document.getElementById("cetakSKS").textContent =
            formatRupiah(hasil.totalSKS);

        document.getElementById("cetakTambahan").textContent =
            formatRupiah(data.tambahan);

        document.getElementById("cetakTotal").textContent =
            formatRupiah(hasil.total);

        document.getElementById("tanggalCetak").textContent =
            "Tanggal: " + new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        document.getElementById("namaTandaTangan").textContent =
            data.nama;

        document.getElementById("nimTandaTangan").textContent =
            data.nim;
    }

    // TOMBOL HITUNG
    tombolHitung.addEventListener("click", function () {

        const data = ambilData();

        if (!validasiData(data)) {
            return;
        }

        const hasil = hitungTotal(data);

        tampilkanHasil(data, hasil);
        perbaruiLaporan(data, hasil);

        document.querySelector(".screen-results").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });

    // TOMBOL RESET
    tombolReset.addEventListener("click", function () {

        const semuaInput = [
            "nama",
            "nim",
            "prodi",
            "biayaKuliah",
            "jumlahSKS",
            "tarifSKS",
            "biayaTambahan"
        ];

        semuaInput.forEach(function (id) {
            document.getElementById(id).value = "";
        });

        document.getElementById("hasilDasar").textContent = "Rp 0";
        document.getElementById("hasilSKS").textContent = "Rp 0";
        document.getElementById("hasilTambahan").textContent = "Rp 0";
        document.getElementById("hasilTotal").textContent = "Rp 0";

        document.getElementById("cetakNama").textContent = "-";
        document.getElementById("cetakNim").textContent = "-";
        document.getElementById("cetakProdi").textContent = "-";
        document.getElementById("cetakDasar").textContent = "Rp 0";
        document.getElementById("cetakSKS").textContent = "Rp 0";
        document.getElementById("cetakTambahan").textContent = "Rp 0";
        document.getElementById("cetakTotal").textContent = "Rp 0";
        document.getElementById("tanggalCetak").textContent = "Tanggal: -";
        document.getElementById("namaTandaTangan").textContent =
            "(Nama Mahasiswa)";
        document.getElementById("nimTandaTangan").textContent = "-";

        document.getElementById("nama").focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // TOMBOL CETAK
    tombolCetak.addEventListener("click", function () {

        const data = ambilData();

        if (!validasiData(data)) {
            return;
        }

        const hasil = hitungTotal(data);

        tampilkanHasil(data, hasil);
        perbaruiLaporan(data, hasil);

        window.print();
    });

    // ENTER UNTUK BERPINDAH KE KOLOM SELANJUTNYA
    const urutanInput = [
        "nama",
        "nim",
        "prodi",
        "biayaKuliah",
        "jumlahSKS",
        "tarifSKS",
        "biayaTambahan"
    ];

    urutanInput.forEach(function (id, index) {

        const input = document.getElementById(id);

        input.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                const idBerikutnya = urutanInput[index + 1];

                if (idBerikutnya) {

                    document.getElementById(idBerikutnya).focus();

                } else {

                    tombolHitung.click();

                }
            }
        });
    });

});
