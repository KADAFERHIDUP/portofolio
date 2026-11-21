# Portofolio Ahmad Umraithi

Situs satu halaman (React 19 + Framer Motion), dibangun dari prompt template Renando dan diisi data CV Ahmad.

## Jalankan
```
npm install
npm run build      # -> Asset/dist/app.js + Asset/dist/app.css
npx serve .        # buka http://localhost:3000
```
Online di **https://portofolio.kadaferhidup.my.id**. Setiap push ke `main`, GitHub Actions (`.github/workflows/pages.yml`) menjalankan `npm run build` lalu menerbitkan `index.html`, `CNAME`, dan `Asset/` ke GitHub Pages.

Pengaturan sekali saja: **Settings → Pages → Source: GitHub Actions**, lalu di DomaiNesia tambahkan record `CNAME` dengan nama `portofolio` dan nilai `kadaferhidup.github.io`.

## Yang perlu kamu ganti
- **Foto**: simpan PNG transparan 1024×1536 ke `Asset/img/`, lalu ubah `PORTRAIT` di `src/app.jsx` dan link `preload` di `index.html`.
- **Project**: tambah entri di `src/data/projects.json` (field: type, title, description, media, role, year, category, image, link).
  Field tambahan `repo` untuk link kode di GitHub. `type`: `backend` | `app` | `website` | `web3` | `image` | `youtube` | `drive`. Kategori filter: Backend, Web, Web3, Mobile.
  Project unggulan diatur di konstanta `featured` di atas `src/app.jsx`.
- **Pengalaman Web3**: tambahkan di array `experiences` di `src/app.jsx`.
- **Sertifikat**: isi `image` di array `certificates` dengan path scan sertifikat.
- **Logo organisasi/klien**: isi `src/data/brands.json` (`{"file":"logo.png","name":"Nama"}`, file di `Asset/svg/brand/`). Deretan logo muncul otomatis kalau daftarnya tidak kosong.

Folder `preview/` hanya untuk build pratinjau offline (pengganti framer-motion/lucide). Tidak dipakai saat `npm run build`.
