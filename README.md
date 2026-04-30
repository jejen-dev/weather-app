# 🌤️ Weather App – Cuaca Pintar

Aplikasi cuaca real-time yang memberikan informasi akurat dan mudah dipahami. Dibangun dengan **React**, **OpenWeatherMap API**, dan **Vercel Serverless Functions**. Menampilkan cuaca terkini, prakiraan per jam (24 jam), prakiraan 5 hari, serta dukungan pencarian kota dan toggle satuan (°C/°F).

> 🔗 **Demo Langsung:** [weather-app-ten-blond-23.vercel.app](https://weather-app-ten-blond-23.vercel.app)

> 📌 **Challenge:** [devChallenges.io – Weather App](https://devchallenges.io/challenge/weather-app)

---

## ✨ Fitur Utama

- **🌡️ Cuaca Saat Ini** – Suhu, feels like, kecepatan angin, suhu min/max, dan ikon cuaca.[reference:0]
- **⏱️ Prakiraan Per Jam** – 8 interval (24 jam ke depan) dengan ikon dan suhu.[reference:1]
- **📅 Prakiraan 5 Hari** – Range suhu harian dengan slider visual, ikon, dan deskripsi cuaca.[reference:2]
- **🔍 Pencarian Kota** – Cari kota mana pun di dunia (menggunakan OpenWeatherMap Geocoding API).[reference:3]
- **🌡️ Toggle Satuan** – Ubah antara Celsius (°C) dan Fahrenheit (°F).[reference:4]
- **🏙️ Daftar Kota Besar** – Tampilkan Jakarta, London, Tokyo, New York sebagai shortcut cepat.[reference:5]
- **📱 Responsif** – Mobile, tablet, dan desktop (mengikuti desain dari devChallenges).[reference:6]
- **🔒 Serverless API** – Endpoint Vercel sebagai proxy ke OpenWeatherMap (melindungi API key).[reference:7]

---

## ⚙️ Teknologi yang Digunakan

- **Frontend** : React 18 (tanpa build tool – menggunakan CDN + Babel standalone)[reference:8]
- **HTTP Client** : Axios[reference:9]
- **Styling** : CSS murni dengan flexbox, grid, dan media queries[reference:10]
- **API** : OpenWeatherMap (Current Weather, 5-day Forecast, Geocoding)[reference:11]
- **Backend (Serverless)** : Vercel Functions (`/api/geo`, `/api/weather`, `/api/forecast`)[reference:12]
- **Deployment** : Vercel[reference:13]

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- **Node.js** (jika ingin menjalankan serverless function secara lokal)
- **OpenWeatherMap API Key** — Dapatkan di [openweathermap.org/api](https://openweathermap.org/api)

### Langkah-langkah

1. **Clone repositori ini**
   ```bash
   git clone https://github.com/jejen-dev/weather-app.git
   cd weather-app
Buat file environment variables

Buat file .env di root proyek dan isi dengan OpenWeatherMap API key Anda:

env
OPENWEATHER_API_KEY=your_api_key_here
Jalankan serverless function secara lokal (opsional)

bash
npm install -g vercel
vercel dev
Buka file index.html langsung di browser atau gunakan Live Server.

Catatan: Untuk keamanan, API key tidak boleh disimpan di frontend. Proyek ini menggunakan Vercel Serverless Functions sebagai proxy, jadi saat dijalankan secara lokal tanpa serverless function, pastikan untuk mengganti endpoint API dengan proxy lokal atau langsung menggunakan OpenWeatherMap API dengan key (hanya untuk development).

📚 Apa yang Saya Pelajari
Selama mengerjakan proyek ini, saya mempelajari beberapa hal penting:

React Tanpa Build Tool — Menggunakan React via CDN + Babel standalone untuk kemudahan部署.

Integrasi OpenWeatherMap API — Menampilkan data cuaca real-time dan prakiraan.

Serverless Functions (Vercel) — Menyembunyikan API key untuk keamanan.

Responsive Design — Mendukung mobile, tablet, dan desktop.

State Management — Mengelola data cuaca dan preferensi pengguna (toggle satuan, kota yang dipilih).

📄 Lisensi
Proyek ini bersifat open-source dan dapat digunakan untuk keperluan belajar maupun pengembangan lebih lanjut.

