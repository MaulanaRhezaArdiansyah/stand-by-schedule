# Quick Deploy Guide - 3 Langkah Mudah

## Cara Tercepat: Double Click `deploy.bat`

1. **Double-click** file `deploy.bat` di Windows Explorer
2. Browser akan terbuka untuk login Vercel (jika belum login)
3. Selesai! URL domain akan muncul di terminal

**Contoh domain yang akan Anda dapat:**
- https://stand-by-schedule.vercel.app
- https://stand-by-schedule-xxxxx.vercel.app

---

## Alternatif: Manual via Command Line

### Windows (Command Prompt atau PowerShell)
```cmd
vercel login
vercel --prod
```

### Atau via Bun
```bash
bun run build
vercel --prod
```

---

## Jika Ingin Deploy ke Netlify

1. Buka https://app.netlify.com/drop
2. Jalankan: `bun run build`
3. Drag & drop folder `dist` ke Netlify Drop
4. Done! Domain langsung tersedia

---

## Jika Ingin Deploy via GitHub + Vercel (Recommended untuk Production)

### Step 1: Push ke GitHub
```bash
# Buat repo baru di GitHub dulu, lalu:
git remote add origin https://github.com/YOUR_USERNAME/stand-by-schedule.git
git push -u origin main
```

### Step 2: Import di Vercel
1. Kunjungi https://vercel.com/new
2. Login dengan GitHub
3. Click "Import" repository stand-by-schedule
4. Vercel akan auto-detect semua settings
5. Click "Deploy"
6. Done! Setiap git push akan auto-deploy

---

## Troubleshooting

### Build error?
Coba gunakan npm:
```bash
npm install
npm run build
```

### Vercel tidak terinstall?
```bash
npm install -g vercel
```

### Butuh domain custom?
1. Deploy dulu ke Vercel/Netlify
2. Beli domain di Namecheap atau Cloudflare
3. Di dashboard Vercel, tambahkan domain custom
4. Update DNS records

---

## Fitur Website

- ✅ Auto-takedown pada: **9 Januari 2026, 23:55 WIB**
- ✅ Countdown timer real-time
- ✅ Responsive design (mobile + desktop)
- ✅ Modern UI dengan gradient & animasi

## Domain Gratis Yang Akan Anda Dapat

Setelah deploy, Anda akan mendapat domain gratis seperti:
- **Vercel**: `https://stand-by-schedule.vercel.app`
- **Netlify**: `https://stand-by-schedule-xxxxx.netlify.app`

Domain ini bisa langsung dibagikan ke team!
