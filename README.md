# Stand By Schedule - Jadwal Stand By Go Live

Website untuk menampilkan jadwal stand by dengan fitur auto-takedown otomatis.

## Fitur

- **Countdown Timer Real-time**: Menampilkan berapa lama lagi sebelum website takedown
- **Auto-Takedown**: Website otomatis menampilkan pesan "Tidak Aktif" setelah **9 Januari 2026, 23:55 WIB**
- **Responsive Design**: Tampil optimal di semua device (mobile, tablet, desktop)
- **Modern UI**: Desain yang menarik dengan gradient dan animasi

## Jadwal Stand By

### Periode 1: 8-9 Januari 2026 (23.30 - 02.00)
- **FO** (Front Office): Dirga
- **MO** (Middle Office): Alawi
- **BO** (Back Office): mip

### Periode 2: 9 Januari 2026 (17.00 - 22.00)

**Front Office (FO):**
- Hilmi (17.00-19.00)
- Ardan (19.00-21.00)
- Pak Rizal (21.00-22.00)

**Middle Office (MO):**
- Rheza (17.00-19.00)
- Vigo (19.00-21.00)
- Farhan (21.00-22.00)

**Back Office (BO):**
- rine (17.00-20.00)
- maul (20.00-22.00)

## Quick Start

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Deploy ke Production

### Opsi 1: Vercel (Recommended - Gratis)

**Via Command Line:**
```bash
# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

**Via GitHub:**
1. Push code ke GitHub repository
2. Kunjungi [vercel.com](https://vercel.com)
3. Import repository Anda
4. Klik Deploy
5. Done! Anda akan dapat domain seperti: `https://stand-by-schedule.vercel.app`

### Opsi 2: Netlify (Gratis)

**Via Netlify Drop:**
1. Build: `bun run build` (atau `npm run build`)
2. Kunjungi [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag & drop folder `dist`
4. Done! Domain akan tersedia dalam beberapa detik

**Via Command Line:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Opsi 3: GitHub Pages (Gratis)

```bash
npm install -D gh-pages
# Tambahkan script "deploy" di package.json
npm run deploy
```

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Bun** - Package Manager & Runtime
- **CSS3** - Styling dengan Gradients & Animations

## Project Structure

```
stand-by-schedule/
├── src/
│   ├── App.tsx          # Main component dengan logic countdown & auto-takedown
│   ├── App.css          # Styling
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## Cara Kerja Auto-Takedown

Website menggunakan `useEffect` hook yang berjalan setiap detik untuk mengecek waktu saat ini. Jika waktu sudah melewati **9 Januari 2026, 23:55 WIB**, maka:
1. State `isVisible` berubah menjadi `false`
2. Komponen otomatis me-render pesan takedown
3. Jadwal tidak lagi ditampilkan

## Domain Custom

Setelah deploy di Vercel/Netlify, Anda bisa tambahkan domain custom:
1. Beli domain di Namecheap, Cloudflare, atau provider lain
2. Di dashboard Vercel/Netlify, tambahkan custom domain
3. Update DNS records sesuai instruksi
4. Done!

## Support

Untuk panduan lebih detail tentang deployment, lihat file `DEPLOYMENT.md`

## License

MIT License - Silakan digunakan untuk keperluan apapun
