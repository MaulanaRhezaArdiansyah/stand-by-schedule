# GitHub Gist Setup Instructions

## Step 1: Buat GitHub Gist

1. Buka https://gist.github.com/
2. Login dengan akun GitHub kamu
3. Buat Gist baru dengan:
   - **Filename**: `gist-data.json`
   - **Content**: Copy semua isi dari file `gist-data-template.json`
4. Pilih "Create secret gist" atau "Create public gist" (terserah)
5. Klik **Create secret gist** atau **Create public gist**

## Step 2: Dapatkan Raw URL

Setelah Gist dibuat:

1. Klik tombol **Raw** di kanan atas file
2. Copy URL dari address bar browser
3. URL akan seperti ini:
   ```
   https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/COMMIT_HASH/gist-data.json
   ```

**PENTING**: Untuk mendapatkan URL yang selalu update (tanpa commit hash), hapus bagian commit hash:
```
https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/gist-data.json
```

## Step 3: Update .env File

1. Buka file `.env`
2. Ganti `YOUR_USERNAME/YOUR_GIST_ID` dengan URL yang kamu copy:

```env
# GitHub Gist URL (raw URL untuk data JSON)
GIST_URL=https://gist.githubusercontent.com/rhezaardiansyah/abc123def456/raw/gist-data.json
VITE_GIST_URL=https://gist.githubusercontent.com/rhezaardiansyah/abc123def456/raw/gist-data.json
```

## Step 4: Update Email Data di Gist

Pastikan email di Gist sesuai dengan email di `.env`:

```json
{
  "developers": [
    {
      "id": "dirga",
      "name": "Dirga",
      "role": "Front Office",
      "email": "astya444@gmail.com",  // ← Sesuaikan dengan EMAIL_DIRGA di .env
      "whatsapp": "+6281234567890"
    },
    // ... dst
  ]
}
```

## Step 5: Restart Aplikasi

### Restart Frontend (development):
```bash
bun run dev
```

### Restart Backend (PM2):
```bash
pm2 restart standby-scheduler
```

Atau kalau pakai Task Scheduler, jalankan ulang tasknya:
```batch
schtasks /run /tn "StandByScheduler"
```

## Step 6: Verify

### Check Frontend:
Buka http://localhost:5173 dan pastikan data muncul

### Check Backend:
```bash
# Check health
curl http://localhost:10001/health

# Check PM2 logs
pm2 logs standby-scheduler
```

Pastikan muncul log seperti:
```
✅ Gist data fetched and cached
✅ Loaded 1 month(s) with 9 schedule(s)
✅ Loaded 13 developer(s) data
```

## Update Data di Kemudian Hari

1. Edit Gist di https://gist.github.com/
2. Update data JSON-nya
3. Klik **Update secret gist** atau **Update public gist**
4. Tunggu 5 menit (cache duration) atau restart aplikasi

Cache akan otomatis refresh setiap 5 menit.

## Troubleshooting

### Error "Failed to fetch gist data"
- Pastikan GIST_URL dan VITE_GIST_URL di `.env` benar
- Pastikan URL adalah raw URL (ada `/raw/` di URL)
- Test URL dengan curl: `curl https://gist.githubusercontent.com/...`

### Frontend tidak muncul data
- Check browser console (F12)
- Pastikan VITE_GIST_URL di `.env` sudah benar
- Restart dev server: `bun run dev`

### Backend tidak kirim email
- Check PM2 logs: `pm2 logs standby-scheduler`
- Pastikan GIST_URL di `.env` sudah benar
- Restart PM2: `pm2 restart standby-scheduler`
