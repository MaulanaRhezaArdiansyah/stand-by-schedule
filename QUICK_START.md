# 🚀 Quick Start Guide - Email Reminder Setup

## Step 1: Setup Email Account (Gmail)

1. Buka https://myaccount.google.com/apppasswords
2. Generate app password buat "Stand By Scheduler"
3. Copy password yang dikasih (16 karakter)

## Step 2: Update .env File

Edit file `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com          # 👈 Ganti ini
EMAIL_PASSWORD=your-app-password         # 👈 Ganti ini (16 char dari step 1)
EMAIL_FROM=Stand By Scheduler <your-email@gmail.com>
```

## Step 3: Update Developer Emails

Add developer email variables ke `.env` file:

```env
# Developer Emails
EMAIL_DIRGA=dirga@company.com
EMAIL_HILMI=hilmi@company.com
EMAIL_ARDAN=ardan@company.com
EMAIL_ALAWI=alawi@company.com
EMAIL_FARHAN=farhan@company.com
EMAIL_RHEZA=rheza@company.com
EMAIL_VIGO=vigo@company.com
EMAIL_RINE=rine@company.com
EMAIL_IRA=ira@company.com
EMAIL_MIFTAH=miftah@company.com
EMAIL_MAULANA=maulana@company.com
EMAIL_CHABIB=chabib@company.com
EMAIL_NEZA=neza@company.com
```

💡 Ganti email sesuai dengan email developer yang bener.

## Step 4: Test Email (Optional)

Jalanin scheduler:
```bash
bun run scheduler
```

Kalo sukses, bakal muncul:
```
✅ Email configuration verified
✅ Loaded 1 month(s) of schedules
✅ Email scheduler is running!
```

## Step 5: Deploy ke Production

Pilih salah satu:

### Option A: PM2 (Recommended)
```bash
bun install -g pm2
pm2 start "bun run scheduler" --name "standby-scheduler"
pm2 save
```

### Option B: Manual (Keep terminal open)
```bash
bun run scheduler
```

---

## 📧 Cara Kerja:

1. **Setiap hari jam 17:00 WIB**:
   - Cek apakah besok ada schedule
   - Kalo ada, kirim email H-1 reminder ke developer yang stand by

2. **Setiap hari jam 06:00 WIB**:
   - Cek apakah hari ini ada schedule
   - Kalo ada, kirim email reminder ke developer yang stand by

## 📝 Notes:

- Email otomatis terkirim sesuai jadwal di `src/server/index.ts`
- Template email ada di `src/services/emailTemplates.ts`
- Bisa customize waktu kirim di `src/services/scheduler.ts`

## ❓ Troubleshooting:

**Email ga terkirim?**
- Check `.env` file, pastikan EMAIL_USER dan EMAIL_PASSWORD benar
- Pastikan app password dari Gmail (bukan password biasa)

**Scheduler ga jalan?**
- Check apakah proses masih running
- Check timezone (harus Asia/Jakarta)

---

**Dokumentasi lengkap**: Liat `EMAIL_SETUP.md`
