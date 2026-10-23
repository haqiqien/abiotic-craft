# Alkimia Benda Mati & Teknologi (Inanimate & Tech Alchemy)

Sebuah game puzzle alkimia *mobile-first* bertema sains material, geologi, dan rekayasa teknologi yang dimulai dari 4 elemen dasar (**Air, Api, Tanah, Udara**) hingga mencapai teknologi mutakhir (**Komputer, Satelit, Reaktor Nuklir, Jaringan Kuantum**) dengan aturan mutlak 100% bebas makhluk hidup, dilengkapi fitur unduh/salin kode 1-file HTML mandiri (*standalone*).

## User Review & Critical Decisions

> [!IMPORTANT]
> Berikut adalah keputusan desain yang telah dikonfirmasi dari jawaban Anda serta aturan inti yang akan diterapkan:

- **Confirmed Decision 1 (Interaksi Ganda — Ketuk & Seret)**: Pemain dapat memilih elemen dengan **mengetuk cepat (Tap)** untuk langsung mengisi slot penggabungan aktif, maupun **menyeret & melepas (Drag & Drop)** kartu elemen ke meja sintesis.
- **Confirmed Decision 2 (Buku Petunjuk Resep Terkunci)**: Menampilkan daftar resep yang belum ditemukan dalam bentuk rumus `Elemen A + [ ? ] = ???` (menampilkan 1 bahan pembentuk yang sudah dimiliki pemain sebagai petunjuk) serta filter berdasarkan tingkatan teknologi (*Tier*).
- **Confirmed Decision 3 (Game Interaktif + Ekspor 1-File HTML Mandiri)**: Selain langsung dimainkan secara penuh di aplikasi web ini (dengan tata letak adaptif untuk layar HP portrait dan layar desktop), tersedia modal/fitur khusus untuk **Menyalin Kode HTML** atau **Mengunduh File `.html` Tunggal** (lengkap dengan HTML, CSS, dan JS di dalamnya) agar dapat dijalankan secara mandiri di mana saja.
- **Aturan Mutlak Konten (100% Benda Mati & Teknologi)**: Seluruh elemen, nama, deskripsi ilmiah singkat, dan ikon emoji diverifikasi ketat agar tidak mengandung unsur biologis (tanpa manusia, hewan, tumbuhan, kayu, batu bara organik, bakteri, atau bagian tubuh).

---

## 1. Overview & Core Concept

- **What It Does**: Pemain mengeksplorasi lebih dari **48 elemen dan 55+ resep kombinasi berjenjang** yang terbagi ke dalam 5 era/tingkatan (*Tier*):
  1. **Tier 0 — Elemen Primordial**: Air 💧, Api 🔥, Tanah 🌍, Udara 💨.
  2. **Tier 1 — Fenomena Alam & Geologi Dasar**: Uap ♨️, Lumpur 🟤, Lava 🌋, Debu 🌫️, Batu 🪨, Energi ⚡, Tekanan 🗜️, Hujan 🌧️, Gempa 🫨, Angin Topan 🌪️.
  3. **Tier 2 — Mineral, Logam & Material Konstruksi**: Pasir ⏳, Batu Bata 🧱, Kaca 🪟, Bijih Logam ⛏️, Logam ⚙️, Karbon 🖤, Baja 🔩, Keramik 🏺, Kristal Kuarsa 💎, Magnet 🧲, Kawat Tembaga ➰.
  4. **Tier 3 — Mesin Mekanik & Kelistrikan**: Listrik 🌩️, Baterai 🔋, Mesin Uap 🚂, Roda Gigi ⚙️, Bohlam 💡, Lensa 🔎, Dinamo 🔄, Sirkuit Elektronik 📟, Gelombang Radio 📡, Panel Surya ☀️, Laser 🔴.
  5. **Tier 4 — Teknologi Canggih & Eksplorasi Antariksa**: Mikroprosesor 🖥️, Komputer 💻, Layar Optik 🖥️, Serat Optik 🌐, Internet 🛰️, Radar 📡, Mesin Jet 🚀, Roket 🛸, Satelit 🛰️, Reaktor Fusi ⚛️, Superkonduktor ❄️, Komputer Kuantum 💠.
- **Target Audience / Persona**: Penggemar game *crafting/alchemy* kasual di perangkat mobile maupun desktop yang menyukai logika fisika, kimia material, dan keteknikan.
- **Key Value**: Memberikan pengalaman sintesis elemen yang responsif dengan umpan balik suara berbasis *Web Audio API* (tanpa aset eksternal), penyimpanan otomatis di `localStorage`, buku petunjuk terstruktur, serta generator kode HTML *single-file* siap pakai.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Meja Sintesis (Altar Penggabungan)**: Di bagian atas/tengah terdapat 2 slot sintesis (`Slot 1` + `Slot 2` $\rightarrow$ `Hasil`). Saat 2 elemen masuk ke dalam slot, sistem langsung mengecek resep:
     - *Kombinasi Valid & Baru*: Animasi kilau sintesis, efek suara kristal/kemenangan, lencana **"Penemuan Baru!"**, dan elemen baru otomatis masuk ke inventaris.
     - *Kombinasi Valid & Sudah Ditemukan*: Menampilkan elemen hasil dengan penanda sudah ditemukan.
     - *Kombinasi Tidak Bereaksi*: Animasi getar halus (*shake*) dengan pesan informatif tanpa menghukum pemain.
  2. **Inventaris Elemen & Filter Cepat**: Di bawah meja sintesis terdapat bilah pencarian instan, filter kategori *Tier* (Semua, Alam, Material, Mesin, Teknologi Tinggi), dan grid kartu elemen dengan ukuran target sentuh ramah ibu jari ($\ge 48 \times 48\text{px}$).
  3. **Buku Petunjuk Resep (Hint Book)**: Menampilkan daftar seluruh target penemuan yang masih terkunci. Jika pemain sudah membuka salah satu bahan pembentuknya, buku petunjuk menampilkan `Bahan A + [ ? ] = [ Terkunci ]` beserta tombol untuk langsung memasukkan `Bahan A` ke meja sintesis.
  4. **Ensiklopedia & Pohon Resep**: Menampilkan riwayat kombinasi yang sudah berhasil ditemukan beserta catatan singkat fakta fisika/teknologinya.
  5. **Ekspor 1-File HTML Mandiri**: Tombol di bilah atas membuka panel kode lengkap `alkimia-teknologi.html` yang bisa langsung diunduh (`.html`) atau disalin ke *clipboard*.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: **Dark Industrial Laboratory** — estetika laboratorium material modern yang bersih, berfokus pada keterbacaan tinggi, kontras tajam, dan tata letak ergonomis untuk satu tangan di layar HP portrait maupun tampilan dua kolom proporsional di layar lebar.
  - *Color Palette & Mood (60-30-10 Rule)*:
    - **60% Dominant Canvas**: Deep Obsidian Slate (`#0B0F19` / `slate-950`) sebagai latar utama.
    - **30% Structural Surfaces**: Gunmetal Panel (`#111827` / `slate-900`) dan kartu elemen (`#1E293B` / `slate-800`) dengan garis batas tipis (`1px solid rgba(255,255,255,0.08)`).
    - **10% Focal Accents**: Cyan Plasma (`#06B6D4`) untuk aksi sintesis utama, Amber Forge (`#F59E0B`) untuk penemuan baru dan petunjuk, serta Emerald (`#10B981`) untuk indikator progres selesai.
  - *Typography & Hierarchy*:
    - Display & Judul: `Outfit` atau `Plus Jakarta Sans` (tegas, geometris, modern).
    - Body & Label Elemen: `Plus Jakarta Sans` dengan keterbacaan tinggi pada ukuran kecil.
    - Angka & Progres: `JetBrains Mono` (`tabular-nums`) untuk penghitung elemen (`4 / 48 Ditemukan`) dan rumus resep.
  - *Component Styling & Layout*:
    - Pada layar **Mobile Portrait ($375\text{px}$–$430\text{px}$)**: Struktur vertikal ergonomis dengan Header Progres ringkas di atas, Meja Sintesis di area tengah, Grid Elemen yang dapat digulir, dan Bilah Navigasi Bawah (*Bottom Tab Bar*: Sintesis, Petunjuk, Ensiklopedia, Kode HTML).
    - Pada layar **Desktop**: Tampilan terpusat dengan *Phone Frame* interaktif di sisi utama dan panel *Live Blueprint / Buku Petunjuk & Ekspor HTML* di sisi pendamping agar ruang layar lebar tetap terisi secara elegan.
- **Interactive Feedback & Motion**:
  - Transisi halus ($\le 200\text{ms}$) menggunakan `transform` dan `opacity`.
  - Efek suara sintetis murni menggunakan **Web Audio API** (ketukan elemen, penggabungan berhasil, penemuan baru, dan kombinasi gagal) dengan tombol bisukan (*Mute/Unmute*).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Arsitektur Dual-Mode (Aplikasi Interaktif + Generator 1-File HTML)**
  - *Chosen Approach*: Menyediakan pengalaman game penuh langsung di kanvas utama sekaligus menyertakan generator mandiri yang merakit seluruh logika, data 48+ elemen, gaya CSS, dan skrip ke dalam satu file `.html` utuh yang dapat diunduh atau disalin kapan saja.
  - *Why*: Memenuhi kebutuhan pengguna yang ingin mencoba dan memainkan game secara langsung di preview sekaligus memiliki file `.html` tunggal portabel sesuai spesifikasi prompt.
- **Decision 2: Penyimpanan Otomatis `localStorage` dengan Fitur Reset Aman**
  - *Chosen Approach*: Setiap elemen baru dan riwayat resep yang terbuka langsung disimpan ke `localStorage` per perubahan state. Dilengkapi konfirmasi dua langkah (*inline confirmation*, tanpa `window.alert`/`window.confirm`) saat pemain ingin mengatur ulang progres.
  - *Why*: Menjamin progres pemain aman saat halaman dimuat ulang dan mematuhi batasan lingkungan iframe.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ALKIMIA BENDA MATI & TEKNOLOGI                      │
├───────────────────────────────────┬─────────────────────────────────────┤
│        STATE & DATA ENGINE        │         AUDIO & PERSISTENCE         │
│  • 48+ Non-Living Elements DB     │  • localStorage Auto-Sync           │
│  • 55+ Tiered Recipe Graph        │  • Web Audio API Synthesizer        │
│  • Hint Resolver (1-Ingredient)   │  • Standalone 1-File HTML Builder   │
└─────────────────┬─────────────────┴──────────────────┬──────────────────┘
                  │                                    │
                  ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     RESPONSIVE MOBILE-FIRST INTERFACE                   │
├──────────────────────┬───────────────────────┬──────────────────────────┤
│   SYNTHESIS ALTAR    │   ELEMENT INVENTORY   │   HINT & ARCHIVE TABS    │
│ • Slot A + Slot B    │ • Search & Tier Tabs  │ • Locked Recipe Hints    │
│ • Tap & Drag-Drop    │ • Thumb-Friendly Grid │   (Elem A + [?] = ???)   │
│ • Instant Reaction   │ • Quick-Add Affordance│ • Discovered Tech Tree   │
│ • Discovery Banner   │ • New Badge Indicator │ • 1-File HTML Exporter   │
└──────────────────────┴───────────────────────┴──────────────────────────┘
```

- **Data Model & State**:
  - `ElementItem`: `{ id, name, emoji, tier: 0|1|2|3|4, category, description }` — seluruh entitas dipastikan 100% benda mati, mineral, fenomena fisika, atau teknologi.
  - `Recipe`: `{ a: string, b: string, result: string }` — mendukung sifat komutatif (`A + B === B + A`) dan kombinasi elemen kembar (`A + A`, seperti `Air + Air = Lautan` atau `Batu + Batu = Percikan Api / Batu Asah`).
  - `GameState`: Menyimpan `unlockedIds: string[]`, `discoveredRecipes: string[]`, `slotA: string | null`, `slotB: string | null`, `soundEnabled: boolean`, dan `activeTab: 'play' | 'hints' | 'codex' | 'export'`.
- **Interactive Component & State Mapping**:
  - **Ketuk / Drag Elemen**: Mengetuk elemen di inventaris mengisi `slotA` (jika kosong) atau `slotB` (jika `slotA` terisi). Menyeret kartu elemen ke area meja sintesis juga langsung menempatkannya ke slot yang tersedia.
  - **Evaluasi Sintesis Otomatis**: Begitu `slotA` dan `slotB` terisi, mesin resep mencari pasangan `[slotA, slotB]` (tidak peduli urutan). Jika cocok, elemen hasil ditampilkan, ditambahkan ke `unlockedIds`, dan disimpan ke `localStorage`.
  - **Buku Petunjuk Dinamis**: Mengiterasi seluruh elemen yang belum terbuka di `unlockedIds`, mencari resep pembentuknya yang minimal salah satu bahannya sudah terbuka, lalu menampilkan bahan pertama beserta tombol **"Gunakan Bahan"** yang langsung memuat bahan tersebut ke `slotA`.
