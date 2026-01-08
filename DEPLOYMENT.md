# Panduan Deployment - Stand By Schedule

Website ini sudah siap untuk di-deploy! Ada beberapa opsi deployment gratis yang bisa Anda gunakan:

## Opsi 1: Deploy ke Vercel (Recommended)

### Cara 1: Via GitHub (Otomatis)
1. Buat repository baru di GitHub
2. Push code ini ke GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME/stand-by-schedule.git
   git push -u origin main
   ```
3. Kunjungi https://vercel.com
4. Login dengan GitHub
5. Klik "New Project"
6. Import repository "stand-by-schedule"
7. Vercel akan otomatis detect settings, klik "Deploy"
8. Selesai! Domain akan tersedia di `https://stand-by-schedule-xxxxx.vercel.app`

### Cara 2: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Opsi 2: Deploy ke Netlify

### Via Netlify Drop
1. Build project: `bun run build` (atau gunakan npm: `npm run build`)
2. Kunjungi https://app.netlify.com/drop
3. Drag & drop folder `dist` ke Netlify Drop
4. Selesai! Domain akan tersedia dalam beberapa detik

### Via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Opsi 3: Deploy ke GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Tambahkan di package.json scripts:
   ```json
   "deploy": "vite build && gh-pages -d dist"
   ```
3. Update vite.config.ts dengan base URL repository
4. Run: `npm run deploy`

## Fitur Website

### Auto-Takedown
Website akan otomatis menampilkan pesan "Jadwal Sudah Tidak Aktif" setelah:
**9 Januari 2026, Pukul 23:55 WIB**

### Countdown Timer
Website menampilkan countdown timer real-time yang menunjukkan berapa lama lagi sebelum takedown.

### Responsive Design
Website sudah responsive dan bisa diakses dengan baik di mobile maupun desktop.

## Tech Stack
- React 19
- TypeScript
- Vite
- Bun

## Development

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

## Domain Custom (Opsional)

Jika ingin menggunakan domain custom:
1. Beli domain di Namecheap, GoDaddy, atau Cloudflare
2. Di Vercel/Netlify, tambahkan custom domain
3. Update DNS records sesuai instruksi platform
