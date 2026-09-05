import { prisma } from '@/lib/prisma';
import { PostCategory, CurriculumCategory } from '@/app/generated/prisma/enums';
import bcrypt from 'bcryptjs';

async function main() {
  const password = await bcrypt.hash('12345678', 10);

  await prisma.user.upsert({
    where: { email: 'ryotwell@icloud.com' },
    update: {},
    create: {
      name: 'Zulzario Zaeri',
      email: 'ryotwell@icloud.com',
      password,
    },
  });

  await prisma.batch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'BATCH-2025-01',
      jalur: 'UMUM',
      isActive: true,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),
    },
  });

  // Clean slate
  await prisma.post.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.faq.deleteMany();

  // ── Posts (9: 3 BERITA, 3 ARTIKEL, 3 INFORMASI) ──
  // const posts = [
  //   // ── BERITA ──
  //   {
  //     title: 'Siswa SMP Unggulan Raih Medali Emas OSN Tingkat Provinsi',
  //     slug: 'raih-medali-emas-osn-2025',
  //     description:
  //       'Prestasi membanggakan diraih oleh siswa SMP Unggulan yang berhasil meraih medali emas dalam Olimpiade Sains Nasional (OSN) tingkat Provinsi.',
  //     content:
  //       'Kabar membanggakan datang dari siswa-siswi SMP Unggulan. Tim Olimpiade Sains Nasional (OSN) SMP Unggulan berhasil meraih medali emas dalam kompetisi yang diselenggarakan di tingkat provinsi.\n\nKompetisi yang berlangsung selama tiga hari ini diikuti oleh ribuan peserta dari berbagai sekolah menengah pertama se-provinsi. Bidang yang dilombakan meliputi Matematika, Fisika, Biologi, dan Ilmu Pengetahuan Sosial.\n\nKepala SMP Unggulan menyampaikan apresiasi setinggi-tingginya atas prestasi yang diraih. "Ini adalah bukti bahwa siswa SMP Unggulan mampu bersaing di tingkat tertinggi," ujarnya.',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1523050854058-8df90110c7f9?w=800&q=80',
  //     excerpt:
  //       'Siswa SMP Unggulan raih medali emas OSN tingkat Provinsi. Prestasi membanggakan!',
  //     published: true,
  //     publishedAt: new Date('2025-02-20'),
  //     category: PostCategory.BERITA,
  //   },
  //   {
  //     title: 'Tim Futsal SMP Unggulan Juara Turnamen Antar-Sekolah se-Kota',
  //     slug: 'tim-futsal-juara-turnamen-antar-sekolah',
  //     description:
  //       'Tim futsal SMP Unggulan berhasil membawa pulang trofi juara 1 turnamen antar-SMP se-Kota Yogyakarta.',
  //     content:
  //       'Tim futsal SMP Unggulan menunjukkan performa terbaiknya dalam turnamen futsal antar-SMP se-Kota Yogyakarta yang berlangsung di GOR Amongraga. Berlaga selama dua hari penuh, tim futsal SMP Unggulan berhasil mengalahkan lawan-lawannya dengan skor meyakinkan.\n\nManajer tim menyatakan bahwa kemenangan ini adalah hasil dari latihan rutin yang dijalani para pemain setiap sore. "Kami sangat bangga dengan perjuangan mereka. Semoga ini menjadi motivasi untuk meraih prestasi yang lebih tinggi lagi."\n\nSelamat kepada seluruh pemain dan pelatih atas prestasi yang luar biasa ini!',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1574629813960-76737844c2c8?w=800&q=80',
  //     excerpt: 'Tim futsal SMP Unggulan juara 1 turnamen futsal antar-SMP se-Kota.',
  //     published: true,
  //     publishedAt: new Date('2025-04-05'),
  //     category: PostCategory.BERITA,
  //   },
  //   {
  //     title: 'SMP Unggulan Gelar Karya P5: Produk Kreatif Bernilai Ekonomis',
  //     slug: 'gelar-karya-p5-produk-kreatif',
  //     description:
  //       'SMP Unggulan menyelenggarakan Gelar Karya Proyek Penguatan Profil Pelajar Pancasila (P5) dengan tema kewirausahaan.',
  //     content:
  //       'RATUSAN siswa SMP Unggulan memadati halaman sekolah dalam acara Gelar Karya P5 yang mengusung tema "Kewirausahaan Kreatif dan Inovatif." Berbagai produk hasil karya siswa dipamerkan dan dijual dalam bazar yang digelar selama dua hari.\n\nProduk yang ditawarkan sangat beragam, mulai dari makanan ringan, minuman kekinian, kerajinan tangan, hingga karya seni daur ulang. Setiap kelompok siswa bertanggung jawab penuh terhadap proses produksi, pemasaran, hingga pencatatan keuangan.\n\nGelar Karya P5 ini bertujuan menanamkan jiwa wirausaha, kreativitas, dan gotong royong sesuai dengan nilai-nilai Pancasila. Acara ini juga dihadiri oleh orang tua siswa dan komite sekolah.',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1523240795612-9a054b0e25c5?w=800&q=80',
  //     excerpt:
  //       'Gelar Karya P5 SMP Unggulan menampilkan produk kreatif bernilai ekonomis karya siswa.',
  //     published: true,
  //     publishedAt: new Date('2025-05-12'),
  //     category: PostCategory.BERITA,
  //   },
  //   // ── ARTIKEL ──
  //   {
  //     title: 'Program Tahfidz Al-Quran SMP Unggulan: Cetak Hafidz Muda',
  //     slug: 'program-tahfidz-al-quran',
  //     description:
  //       'SMP Unggulan meluncurkan program Tahfidz Al-Quran sebagai bagian dari kurikulum unggulan untuk membentuk karakter islami siswa.',
  //     content:
  //       'SMP Unggulan terus berinovasi dalam pengembangan pendidikan karakter. Program Tahfidz Al-Quran menjadi salah satu program unggulan yang bertujuan mencetak hafidz dan hafidzah muda yang berprestasi.\n\nProgram ini terintegrasi dalam kegiatan pembelajaran sehari-hari, dengan target hafalan yang disesuaikan dengan kemampuan masing-masing siswa. Setiap siswa mendapatkan bimbingan dari pembimbing tahfidz yang berpengalaman dan bersertifikat.\n\nSelain menghafal, siswa juga dibimbing untuk memahami makna dan kandungan ayat-ayat Al-Quran sehingga mampu mengamalkannya dalam kehidupan sehari-hari.',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1561715276-fff6a63d2cd4?w=800&q=80',
  //     excerpt:
  //       'Program Tahfidz Al-Quran mencetak hafidz muda berkarakter islami.',
  //     published: true,
  //     publishedAt: new Date('2025-03-10'),
  //     category: PostCategory.ARTIKEL,
  //   },
  //   {
  //     title: 'Pentingnya Literasi Digital bagi Generasi Muda di Era Teknologi',
  //     slug: 'pentingnya-literasi-digital',
  //     description:
  //       'Mengapa literasi digital menjadi keterampilan wajib bagi siswa di tengah pesatnya perkembangan teknologi informasi.',
  //     content:
  //       'Di era digital seperti sekarang, kemampuan literasi digital bukan lagi sekadar pilihan, melainkan sebuah keharusan. SMP Unggulan memahami hal ini dengan mengintegrasikan literasi digital ke dalam kurikulum dan kegiatan sehari-hari.\n\nLiterasi digital mencakup kemampuan mencari, mengevaluasi, dan menggunakan informasi dari berbagai sumber digital secara bijak dan bertanggung jawab. Siswa juga dibekali pemahaman tentang etika berinternet (netiquette), keamanan siber dasar, serta cara menghindari hoaks dan konten negatif.\n\nMelalui program ini, SMP Unggulan berharap siswanya mampu menjadi pengguna teknologi yang cerdas, kreatif, dan tetap berpegang pada nilai-nilai karakter islami.',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1496171367470-9ed9a91e9314?w=800&q=80',
  //     excerpt:
  //       'Literasi digital menjadi keterampilan wajib bagi siswa di era teknologi.',
  //     published: true,
  //     publishedAt: new Date('2025-04-18'),
  //     category: PostCategory.ARTIKEL,
  //   },
  //   {
  //     title: 'Peran Orang Tua dalam Mendukung Kesuksesan Belajar Anak',
  //     slug: 'peran-orang-tua-dukung-belajar-anak',
  //     description:
  //       'Kolaborasi antara sekolah dan orang tua adalah kunci utama dalam membentuk kesuksesan akademik dan karakter siswa.',
  //     content:
  //       'Kesuksesan pendidikan seorang anak tidak hanya ditentukan oleh apa yang terjadi di sekolah. Lingkungan rumah dan peran aktif orang tua menjadi faktor yang sama pentingnya dalam membentuk karakter dan prestasi belajar siswa.\n\nSMP Unggulan secara rutin mengadakan pertemuan orang tua wali dan seminar parenting untuk memperkuat sinergi antara sekolah dan keluarga. Beberapa hal yang dapat dilakukan orang tua antara lain mendampingi belajar, menyediakan lingkungan belajar yang kondusif, serta memberikan motivasi dan apresiasi terhadap pencapaian anak.\n\nDengan komunikasi yang baik antara sekolah dan orang tua, perkembangan siswa dapat terpantau secara holistik — baik dari sisi akademik, sosial, maupun spiritual.',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1471286174890-4e35a9521b8a?w=800&q=80',
  //     excerpt:
  //       'Kolaborasi orang tua dan sekolah menjadi kunci kesuksesan belajar anak.',
  //     published: true,
  //     publishedAt: new Date('2025-05-25'),
  //     category: PostCategory.ARTIKEL,
  //   },
  //   // ── INFORMASI ──
  //   {
  //     title: 'Pendaftaran PPDB SMP Unggulan 2025/2026 Dibuka!',
  //     slug: 'pendaftaran-ppdb-2025-2026',
  //     description:
  //       'Pendaftaran Penerimaan Peserta Didik Baru (PPDB) SMP Unggulan tahun ajaran 2025/2026 telah resmi dibuka. Segera daftarkan putra-putri Anda.',
  //     content:
  //       'SMP Unggulan dengan bangga mengumumkan bahwa Penerimaan Peserta Didik Baru (PPDB) untuk tahun ajaran 2025/2026 telah resmi dibuka. Kami mengundang calon siswa berprestasi dari seluruh Indonesia untuk bergabung dalam lingkungan belajar yang unggul dan berkarakter.\n\nPendaftaran dapat dilakukan secara online melalui website resmi kami. Jalur pendaftaran yang tersedia meliputi jalur Umum dan jalur Prestasi. Pastikan seluruh dokumen persyaratan telah lengkap sebelum melakukan pendaftaran.\n\nJangan lewatkan kesempatan menjadi bagian dari generasi unggul SMP Unggulan!',
  //     excerpt:
  //       'PPDB SMP Unggulan tahun ajaran 2025/2026 dibuka. Daftarkan putra-putri Anda sekarang!',
  //     published: true,
  //     publishedAt: new Date('2025-01-15'),
  //     category: PostCategory.INFORMASI,
  //   },
  //   {
  //     title: 'Jadwal Masa Pengenalan Lingkungan Sekolah (MPLS) 2025/2026',
  //     slug: 'jadwal-mpls-2025-2026',
  //     description:
  //       'Informasi lengkap jadwal dan ketentuan MPLS bagi siswa baru SMP Unggulan tahun ajaran 2025/2026.',
  //     content:
  //       'Masa Pengenalan Lingkungan Sekolah (MPLS) tahun ajaran 2025/2026 di SMP Unggulan akan dilaksanakan pada tanggal 14–18 Juli 2025. Kegiatan ini wajib diikuti oleh seluruh siswa baru sebagai langkah awal beradaptasi dengan lingkungan sekolah.\n\nSelama MPLS, siswa akan dikenalkan dengan visi-misi sekolah, tata tertib, fasilitas sekolah, guru dan staf, serta berbagai kegiatan ekstrakurikuler yang tersedia. Kegiatan dikemas secara edukatif dan menyenangkan dengan bimbingan kakak kelas.\n\nPastikan siswa hadir tepat waktu dengan membawa kelengkapan yang telah diinformasikan melalui website dan surat resmi sekolah.',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
  //     excerpt:
  //       'Jadwal MPLS SMP Unggulan 14–18 Juli 2025, wajib diikuti seluruh siswa baru.',
  //     published: true,
  //     publishedAt: new Date('2025-06-01'),
  //     category: PostCategory.INFORMASI,
  //   },
  //   {
  //     title: 'Informasi Beasiswa Prestasi SMP Unggulan 2025',
  //     slug: 'informasi-beasiswa-prestasi-2025',
  //     description:
  //       'SMP Unggulan membuka pendaftaran beasiswa prestasi bagi calon siswa dan siswa aktif berprestasi di bidang akademik maupun non-akademik.',
  //     content:
  //       'SMP Unggulan kembali membuka program Beasiswa Prestasi untuk tahun ajaran 2025/2026. Beasiswa ini diberikan kepada calon siswa baru maupun siswa aktif yang memiliki prestasi luar biasa di bidang akademik, seni, olahraga, atau keagamaan.\n\nBeasiswa mencakup pembebasan biaya SPP selama satu semester hingga satu tahun ajaran penuh, tergantung pada tingkat prestasi yang diraih. Calon penerima beasiswa akan melalui proses seleksi administrasi dan wawancara.\n\nPendaftaran beasiswa dibuka bersamaan dengan periode PPDB. Informasi lebih lanjut dapat menghubungi bagian kesiswaan SMP Unggulan.',
  //     thumbnail:
  //       'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  //     excerpt:
  //       'Beasiswa Prestasi SMP Unggulan 2025 dibuka, meliputi pembebasan SPP hingga satu tahun.',
  //     published: true,
  //     publishedAt: new Date('2025-06-15'),
  //     category: PostCategory.INFORMASI,
  //   },
  // ];

  const posts = [
    {
      title: 'Welcome to SMPU Hamzanwadi!',
      slug: 'welcome-to-smpu-hamzanwadi',
      description:
        'Selamat datang di website resmi SMPU Hamzanwadi! Temukan berbagai informasi sekolah, kegiatan, prestasi, PPDB, ekstrakurikuler, dan berbagai cerita seru dari sekolah kita.',
      content:
        `Hai! Senang banget akhirnya kamu mampir ke sini. Selamat datang di wajah baru website resmi SMPU Hamzanwadi, tempat di mana informasi dan keseruan sekolah menyatu jadi satu.

  Kita tahu, sekolah itu bukan cuma soal duduk di kelas, mendengarkan guru, dan ngerjain PR. Ada banyak cerita seru, prestasi membanggakan, dan momen-momen "pecah" yang sayang banget kalau dilewatkan. Nah, website ini hadir biar kamu—baik itu calon siswa, siswa aktif, alumni, ataupun bapak/ibu orang tua—bisa ngerasain vibe positif SMPU Hamzanwadi kapan aja dan di mana aja.

  Di sini, kamu nggak perlu lagi bingung cari info yang simpang siur.

  - Lagi cari info Penerimaan Peserta Didik Baru (PPDB) yang anti ribet? Ada.
  - Mau intip kegiatan ekstrakurikuler yang lagi hits minggu ini? Ada fotonya.
  - Atau sekadar ngecek jadwal akademik biar nggak salah tanggal ujian? Semuanya lengkap.

  Website ini didesain khusus biar gampang diakses dan enak dibaca. Jadi, jangan ragu buat jelajahi setiap sudut menunya. Anggap saja rumah sendiri!

  Pantengin terus update-nya biar kamu selalu up-to-date dan nggak kudet sama perkembangan sekolah kita tercinta.

  Selamat menjelajah, guys!`,
      thumbnail:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      excerpt:
        'Selamat datang di website resmi SMPU Hamzanwadi. Temukan berbagai informasi, kegiatan, prestasi, dan cerita seru seputar sekolah.',
      published: true,
      publishedAt: new Date('2025-06-15'),
      category: PostCategory.INFORMASI,
    },
    {
      title: 'Welcome to SMPU Hamzanwadi!',
      slug: 'welcome-to-smpu-hamzanwadi',
      description:
        'Selamat datang di website resmi SMPU Hamzanwadi! Temukan berbagai informasi sekolah, kegiatan, prestasi, PPDB, ekstrakurikuler, dan berbagai cerita seru dari sekolah kita.',
      content:
        `Hai! Senang banget akhirnya kamu mampir ke sini. Selamat datang di wajah baru website resmi SMPU Hamzanwadi, tempat di mana informasi dan keseruan sekolah menyatu jadi satu.

  Kita tahu, sekolah itu bukan cuma soal duduk di kelas, mendengarkan guru, dan ngerjain PR. Ada banyak cerita seru, prestasi membanggakan, dan momen-momen "pecah" yang sayang banget kalau dilewatkan. Nah, website ini hadir biar kamu—baik itu calon siswa, siswa aktif, alumni, ataupun bapak/ibu orang tua—bisa ngerasain vibe positif SMPU Hamzanwadi kapan aja dan di mana aja.

  Di sini, kamu nggak perlu lagi bingung cari info yang simpang siur.

  - Lagi cari info Penerimaan Peserta Didik Baru (PPDB) yang anti ribet? Ada.
  - Mau intip kegiatan ekstrakurikuler yang lagi hits minggu ini? Ada fotonya.
  - Atau sekadar ngecek jadwal akademik biar nggak salah tanggal ujian? Semuanya lengkap.

  Website ini didesain khusus biar gampang diakses dan enak dibaca. Jadi, jangan ragu buat jelajahi setiap sudut menunya. Anggap saja rumah sendiri!

  Pantengin terus update-nya biar kamu selalu up-to-date dan nggak kudet sama perkembangan sekolah kita tercinta.

  Selamat menjelajah, guys!`,
      thumbnail:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      excerpt:
        'Selamat datang di website resmi SMPU Hamzanwadi. Temukan berbagai informasi, kegiatan, prestasi, dan cerita seru seputar sekolah.',
      published: true,
      publishedAt: new Date('2025-06-15'),
      category: PostCategory.INFORMASI,
    },

    {
      title: 'Peletakan Batu Pertama Pembangunan SMP Unggulan Hamzanwadi',
      slug: 'peletakan-batu-pertama-pembangunan-smp-unggulan-hamzanwadi',
      description:
        'Pembangunan SMP Unggulan Hamzanwadi resmi dimulai melalui prosesi peletakan batu pertama di kawasan Sawing, Kelurahan Majidi, Kecamatan Selong, Lombok Timur.',
      content:
        `Pembangunan SMP Unggulan Hamzanwadi resmi dimulai dengan prosesi peletakan batu pertama yang berlangsung khidmat pada Rabu, 15 April 2026. Kegiatan ini dilaksanakan di kawasan Sawing, Kelurahan Majidi, Kecamatan Selong, Lombok Timur, sebagai langkah awal dalam mewujudkan fasilitas pendidikan unggulan yang diharapkan mampu mencetak generasi berprestasi dan berakhlak mulia.

  Acara tersebut dihadiri langsung oleh Dr. Ir. Hj. Sitti Rohmi Djalilah, M.Pd. selaku founder SMP Unggulan Hamzanwadi, yang akrab disapa Ummi Rohmi. Turut hadir pula Ketua YPH PPD NWDI Pancor Dr. H. Muhammad Djamaluddin, B.E., M.Kom., amidul MDQH NWDI Pancor TGH. M. Yusuf Ma'mun, para kepala sekolah di lingkungan YPH PPD NWDI Pancor, lurah, kepala lingkungan, orang tua/wali murid SMP Unggulan Hamzanwadi, serta guru-guru dari SD Unggulan Hamzanwadi.

  Dalam sambutannya, Ummi Rohmi menyampaikan harapan besar agar pembangunan sekolah ini dapat menjadi tonggak penting dalam meningkatkan kualitas pendidikan di daerah Lombok Timur. Ia menekankan pentingnya sinergi antara yayasan, tenaga pendidik, serta masyarakat dalam menciptakan lingkungan belajar yang unggul dan berdaya saing.

  Prosesi peletakan batu pertama ini tidak hanya menjadi simbol dimulainya pembangunan fisik, tetapi juga sebagai wujud komitmen bersama dalam membangun generasi masa depan yang berilmu, berkarakter, dan siap menghadapi tantangan global. Dengan adanya SMP Unggulan Hamzanwadi, diharapkan akses terhadap pendidikan berkualitas semakin terbuka luas bagi masyarakat sekitar.

  Kegiatan ini ditutup dengan doa bersama sebagai bentuk harapan agar proses pembangunan berjalan lancar dan memberikan manfaat yang besar bagi dunia pendidikan, khususnya di wilayah Lombok Timur.`,
      thumbnail:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
      excerpt:
        'Pembangunan SMP Unggulan Hamzanwadi resmi dimulai melalui prosesi peletakan batu pertama pada 15 April 2026 di Lombok Timur.',
      published: true,
      publishedAt: new Date('2026-04-16'),
      category: PostCategory.BERITA,
    },
  ];


  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  // ── Facilities ──

  const facilities = [
    {
      name: 'Perpustakaan',
      image: '/assets/facilities/perpustakaan.jpg',
      description:
        'Perpustakaan sekolah dengan koleksi buku pelajaran, pengetahuan umum, dan bacaan pendukung untuk menunjang kegiatan belajar siswa.',
    },
    {
      name: 'Laboratorium Komputer',
      image: '/assets/facilities/lab-komputer.jpg',
      description:
        'Laboratorium komputer yang dilengkapi perangkat komputer dan akses internet untuk mendukung pembelajaran teknologi informasi dan keterampilan digital siswa.',
    },
    {
      name: 'Lapangan Olahraga',
      image: '/assets/facilities/lapangan-olahraga.jpg',
      description:
        'Lapangan olahraga yang digunakan untuk berbagai kegiatan seperti futsal, voli, basket, dan aktivitas olahraga lainnya guna mendukung kebugaran dan pengembangan bakat siswa.',
    },
    // {
    //   name: 'Kantin',
    //   image: '/assets/facilities/kantin.jpg',
    //   description:
    //     'Kantin sekolah yang menyediakan berbagai makanan dan minuman dengan lingkungan yang bersih dan nyaman untuk mendukung kebutuhan siswa selama berada di sekolah.',
    // },
  ];

  for (const facility of facilities) {
    await prisma.facility.create({ data: facility });
  }

  // ── Curriculum (Extracurricular, Program Unggulan, Ko-Curricular) ──
  const curricula = [
    // EXTRACURRICULAR
    {
      name: 'Pramuka',
      image: '/assets/curriculum/pramuka.jpg',
      category: CurriculumCategory.EXTRACURRICULAR,
      description:
        'Gerakan Pramuka sebagai ekstrakurikuler wajib yang membentuk kedisiplinan, kemandirian, dan kepemimpinan siswa.',
    },
    {
      name: 'Paskibra',
      image: '/assets/curriculum/paskibra.jpg',
      category: CurriculumCategory.EXTRACURRICULAR,
      description:
        'Pasukan Pengibar Bendera yang melatih kedisiplinan, kekompakan, dan rasa cinta tanah air.',
    },
    {
      name: 'Futsal',
      image: '/assets/curriculum/futsal.jpg',
      category: CurriculumCategory.EXTRACURRICULAR,
      description:
        'Kegiatan ekstrakurikuler futsal yang mengembangkan kemampuan bermain sepak bola dalam ruangan, kerja sama tim, disiplin, sportivitas, dan kebugaran jasmani siswa.',
    },
    // PROGRAM UNGGULAN
    {
      name: 'Mengaji Al-Quran',
      image: '/assets/curriculum/tahfidz.jpg',
      category: CurriculumCategory.PROGRAM_UNGGULAN,
      description:
        'Program pembiasaan mengaji Al-Quran yang dilaksanakan setiap hari untuk meningkatkan kemampuan membaca Al-Quran serta membentuk kebiasaan dan kecintaan terhadap Al-Quran.',
    },
    {
      name: 'Bahasa Inggris Harian',
      image: '/assets/curriculum/english.jpg',
      category: CurriculumCategory.PROGRAM_UNGGULAN,
      description:
        'Program pembiasaan menggunakan bahasa Inggris dalam keseharian di lingkungan sekolah untuk meningkatkan kemampuan komunikasi dan membangun kepercayaan diri siswa dalam berbahasa Inggris.',
    },
    // KO-CULLICULAR
    // {
    //   name: 'Proyek Penguatan Profil Pelajar Pancasila (P5)',
    //   image: '/assets/curriculum/p5.jpg',
    //   category: CurriculumCategory.KO_CULLICULAR,
    //   description:
    //     'Proyek lintas disiplin ilmu yang mengimplementasikan nilai-nilai Pancasila dalam kehidupan nyata sesuai Kurikulum Merdeka.',
    // },
    // {
    //   name: 'Karya Ilmiah Remaja',
    //   image: '/assets/curriculum/karya-ilmiah.jpg',
    //   category: CurriculumCategory.KO_CULLICULAR,
    //   description:
    //     'Pembimbingan penulisan karya ilmiah untuk menumbuhkan budaya riset dan inovasi sejak dini.',
    // },
    // {
    //   name: 'Kunjungan Edukasi & Studi Lapangan',
    //   image: '/assets/curriculum/study-tour.jpg',
    //   category: CurriculumCategory.KO_CULLICULAR,
    //   description:
    //     'Kegiatan pembelajaran di luar kelas yang relevan dengan materi pelajaran untuk memberikan pengalaman belajar kontekstual.',
    // },
  ];

  for (const item of curricula) {
    await prisma.curriculum.create({ data: item });
  }

  // ── Requirements ──
  const requirements = [
    { description: 'Mengisi formulir pendaftaran.' },
    { description: 'Foto copy paspor ukuran 3x4 (2 lembar).' },
    { description: 'Fotokopi Akta Kelahiran.' },
    { description: 'Fotokopi Kartu Keluarga (KK).' },
    { description: 'Sertifikat Prestasi (Jika ada).' },
  ];

  for (const req of requirements) {
    await prisma.requirement.create({ data: req });
  }

  // ── FAQs ──
  const faqs = [
    {
      question: 'Bagaimana cara mendaftar PPDB di SMP Unggulan?',
      answer:
        'Pendaftaran dilakukan secara online melalui website resmi SMP Unggulan. Lengkapi formulir pendaftaran, unggah dokumen persyaratan, dan pilih jalur pendaftaran (Umum/Prestasi). Setelah itu, cetak bukti pendaftaran dan tunggu informasi seleksi selanjutnya.',
    },
    {
      question: 'Apa saja jalur pendaftaran yang tersedia?',
      answer:
        'Terdapat dua jalur pendaftaran: (1) Jalur Umum — berdasarkan hasil seleksi akademik dan wawancara; (2) Jalur Prestasi — berdasarkan portofolio prestasi akademik/non-akademik yang dimiliki calon siswa.',
    },
    {
      question: 'Kapan batas waktu pendaftaran PPDB?',
      answer:
        'Informasi batas waktu pendaftaran dapat dilihat pada halaman PPDB website resmi SMP Unggulan. Umumnya pendaftaran dibuka pada bulan Januari hingga Juni setiap tahunnya.',
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }

  console.log('Seeding completed successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });