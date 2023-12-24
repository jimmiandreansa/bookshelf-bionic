// Tunggu hingga halaman HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Elemen-elemen HTML yang diperlukan
  const masukkanDataBuku = document.getElementById("masukkanDataBuku");
  const bukuBelumDibaca = document.getElementById("bukuBelumDibaca");
  const bukuSudahDibaca = document.getElementById("bukuSudahDibaca");

  // Membuat penampungan Array untuk menyimpan data buku
  let books = [];

  // Memeriksa apakah ada data buku di LocalStorage atau belum
  const penyimpanBuku = localStorage.getItem("books");
  if (penyimpanBuku) {
    books = JSON.parse(penyimpanBuku);
  }

  // Fungsi ini untuk menyimpan buku ke LocalStorage
  function simpanBuku() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Menangani form submit untuk menambahkan buku
  masukkanDataBuku.addEventListener("submit", function (e) {
    e.preventDefault();

    // Mendapatkan nilai dari form input user
    const masukkanJudulBuku =
      document.getElementById("masukkanJudulBuku").value;
    const masukkanPenulisBuku = document.getElementById(
      "masukkanPenulisBuku"
    ).value;
    const masukkanTahunBuku = Number(
      document.getElementById("masukkanTahunBuku").value
    );
    const sudahDibaca = document.getElementById("sudahDibaca").checked;

    // Memeriksa apakah buku dengan judul yang sama sudah ada
    const sudahAda = books.some((book) => book.title === masukkanJudulBuku);

    if (sudahAda) {
      alert("Buku dengan judul yang sama sudah ada di dalam daftar.");
    } else {
      // Membuat objek buku baru
      const book = {
        id: new Date().getTime(),
        title: masukkanJudulBuku,
        author: masukkanPenulisBuku,
        year: masukkanTahunBuku,
        isComplete: sudahDibaca,
      };

      // Menyimpan buku ke daftar dan manyimpan ke LocalStorage
      books.push(book);
      simpanBuku();

      // Memperbarui tampilan rak buku
      perbaruiRakBuku();

      // Mengosongkan form input setelah menambahkan data buku
      document.getElementById("masukkanJudulBuku").value = "";
      document.getElementById("masukkanPenulisBuku").value = "";
      document.getElementById("masukkanTahunBuku").value = "";
      document.getElementById("sudahDibaca").checked = false;
    }
  });

  // Fungsi untuk memperbarui tampilan rak buku
  function perbaruiRakBuku() {
    bukuBelumDibaca.innerHTML = "";
    bukuSudahDibaca.innerHTML = "";

    for (const book of books) {
      const itemBuku = buatItemBuku(book);
      console.log(itemBuku);
      if (book.isComplete) {
        bukuSudahDibaca.appendChild(itemBuku);
      } else {
        bukuBelumDibaca.appendChild(itemBuku);
      }
    }
  }

  // Fungsi untuk menghapus buku berdasarkan ID
  function hapusBuku(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      simpanBuku();
      perbaruiRakBuku();
    }
  }

  // Fungsi untuk mengganti status selesai atau belum selesai
  function toggleSelesai(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      simpanBuku();
      perbaruiRakBuku();
    }
  }

  // Menangani form submit untuk pencarian buku
  const cariBuku = document.getElementById("cariBuku");
  const cariJudulBuku = document.getElementById("cariJudulBuku");

  cariBuku.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = cariJudulBuku.value.toLowerCase().trim();

    const hasilCari = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.year.toString().includes(query)
      );
    });

    perbaruiHasilCari(hasilCari);
  });

  // Fungsi untuk memperbarui tampilan hasil pencarian
  function perbaruiHasilCari(hasil) {
    bukuBelumDibaca.innerHTML = "";
    bukuSudahDibaca.innerHTML = "";

    for (const book of hasil) {
      const itemBuku = buatItemBuku(book);
      if (book.isComplete) {
        bukuSudahDibaca.appendChild(itemBuku);
      } else {
        bukuBelumDibaca.appendChild(itemBuku);
      }
    }
  }

  // Fungsi untuk membuat elemen buku di dalam daftar
  function buatItemBuku(book) {
    const itemBuku = document.createElement("article");
    itemBuku.className = "pembungkus-buku";
    itemBuku.style.padding = "8px";
    itemBuku.style.border = "1px solid #afc8ad";
    itemBuku.style.borderRadius = "4px";
    itemBuku.style.marginTop = "8px";

    const title = document.createElement("h3");
    title.textContent = book.title;
    title.style.display = "flex";
    title.style.justifyContent = "center";
    title.style.marginBottom = "8px";

    const author = document.createElement("p");
    author.textContent = "Penulis: " + book.author;
    author.style.color = "#5c8374";

    const year = document.createElement("p");
    year.textContent = "Tahun terbit: " + book.year;
    year.style.color = "#5c8374";

    const tombolAksi = document.createElement("div");
    tombolAksi.className = "tombol-aksi";
    tombolAksi.style.marginTop = "10px";
    tombolAksi.style.display = "flex";
    tombolAksi.style.gap = "8px";

    // Fungsi untuk membuat element tombol aksi
    function buatTombolAksi(text, className, clickHandler) {
      const tombol = document.createElement("button");
      tombol.textContent = text;
      tombol.classList.add(className);
      tombol.addEventListener("click", clickHandler);
      return tombol;
    }

    const tombolHapus = buatTombolAksi(
      "Hapus Buku",
      "tombol-hapus",
      function () {
        hapusBuku(book.id);
      }
    );

    let tombolToggle;
    if (book.isComplete) {
      tombolToggle = buatTombolAksi(
        "Belum selesai",
        "belum-dibaca",
        function () {
          toggleSelesai(book.id);
        }
      );
    } else {
      tombolToggle = buatTombolAksi(
        "Selesai dibaca",
        "selesai-dibaca",
        function () {
          toggleSelesai(book.id);
        }
      );
    }

    // CSS tombol aksi
    tombolHapus.style.backgroundColor = "transparent";
    tombolHapus.style.color = "#1b4242";
    tombolHapus.style.border = "1px solid #afc8ad";
    tombolHapus.style.flex = "1";
    tombolHapus.style.padding = "8px 0";
    tombolHapus.style.fontSize = "16px";
    tombolHapus.style.fontWeight = "500";
    tombolHapus.style.borderRadius = "4px";
    tombolHapus.style.cursor = "pointer";

    tombolToggle.style.backgroundColor = "#5c8374";
    tombolToggle.style.color = "#ffffff";
    tombolToggle.style.flex = "1";
    tombolToggle.style.padding = "8px 0";
    tombolToggle.style.fontSize = "16px";
    tombolToggle.style.fontWeight = "500";
    tombolToggle.style.borderRadius = "4px";
    tombolToggle.style.border = "none";
    tombolToggle.style.cursor = "pointer";

    tombolAksi.appendChild(tombolToggle);
    tombolAksi.appendChild(tombolHapus);

    itemBuku.appendChild(title);
    itemBuku.appendChild(author);
    itemBuku.appendChild(year);
    itemBuku.appendChild(tombolAksi);

    return itemBuku;
  }

  // Memperbarui tampilan rak buku saat halaman dimuat
  perbaruiRakBuku();
});
