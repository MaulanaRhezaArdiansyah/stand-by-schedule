# 🚀 Deploy ke Render.com - Stand By Scheduler

Guide lengkap deploy email scheduler ke Render.com (FREE, NO CREDIT CARD).

---

## 🎯 Kenapa Render.com?

- ✅ **FREE tier** - 750 jam/bulan (cukup buat 24/7)
- ✅ **NO CREDIT CARD** required
- ✅ **Support Bun** via Docker
- ✅ **Auto-deploy** dari GitHub
- ✅ **Always-on** - ga perlu laptop nyala

---

## 📋 Prerequisites

1. **GitHub repo** udah di-push
2. **Email Gmail** dengan app password
3. **Developer emails** semua developer

---

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up Render.com

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub account** (no CC needed!)
4. Authorize Render to access GitHub repos

### Step 2: Create New Web Service

1. Di Render Dashboard, click **"New +"**
2. Pilih **"Web Service"**
3. Connect repository:
   - Pilih repo **`stand-by-schedule`**
   - Click **"Connect"**

### Step 3: Configure Service

**Basic Settings:**
```
Name: standby-scheduler
Region: Singapore (terdekat ke Jakarta)
Branch: main
Runtime: Docker
```

**Build & Deploy:**
```
Dockerfile Path: ./Dockerfile
```

**Instance Type:**
```
Free
```

### Step 4: Set Environment Variables

Di halaman konfigurasi, scroll ke **"Environment Variables"**.

Click **"Add Environment Variable"** dan tambahkan satu-satu:

#### Required Variables:

| Key | Value |
|-----|-------|
| `TZ` | `Asia/Jakarta` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_SECURE` | `false` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | `your-app-password` *(16 char dari Gmail)* |
| `EMAIL_FROM` | `Stand By Scheduler <your-email@gmail.com>` |
| `EMAIL_SUBJECT_H1` | `Reminder: Stand By Besok` |
| `EMAIL_SUBJECT_H` | `Stand By Hari Ini - Jam 06.00` |

#### Developer Email Variables:

| Key | Value |
|-----|-------|
| `EMAIL_DIRGA` | `dirga@company.com` |
| `EMAIL_HILMI` | `hilmi@company.com` |
| `EMAIL_ARDAN` | `ardan@company.com` |
| `EMAIL_ALAWI` | `alawi@company.com` |
| `EMAIL_FARHAN` | `farhan@company.com` |
| `EMAIL_RHEZA` | `rheza@company.com` |
| `EMAIL_VIGO` | `vigo@company.com` |
| `EMAIL_RINE` | `rine@company.com` |
| `EMAIL_IRA` | `ira@company.com` |
| `EMAIL_MIFTAH` | `miftah@company.com` |
| `EMAIL_MAULANA` | `maulana@company.com` |
| `EMAIL_CHABIB` | `chabib@company.com` |
| `EMAIL_NEZA` | `neza@company.com` |

⚠️ **PENTING**:
- Jangan pake quotes di value
- Copy exact value dari `.env` file lu
- Ganti semua email developer dengan email yang bener

### Step 5: Deploy!

1. Click **"Create Web Service"** di bawah
2. Render akan:
   - Clone repo dari GitHub
   - Build Docker image dengan Bun
   - Install dependencies
   - Start scheduler

**Build process** akan makan waktu ~2-3 menit.

### Step 6: Verify Deployment

**Check Logs:**

1. Di Render Dashboard, click service **"standby-scheduler"**
2. Go to **"Logs"** tab
3. Tunggu sampai build selesai

**Expected output:**
```
🚀 Starting Stand By Email Scheduler...
==================================================

🏥 Health check server running on port 10000

📧 Verifying email configuration...
✅ Email configuration verified

📅 Loading schedules data...
✅ Loaded 1 month(s) of schedules

⏰ Starting schedulers...

==================================================
✅ Email scheduler is running!
📝 Schedule:
   - H-1 Reminder: Daily at 17:00 WIB (5 PM)
   - H Reminder:   Daily at 06:00 WIB (6 AM)

💡 Press Ctrl+C to stop the scheduler
==================================================
```

**Check Health:**

Render akan assign URL ke service lu (misal: `https://standby-scheduler-xxx.onrender.com`)

Test health check:
```bash
curl https://standby-scheduler-xxx.onrender.com/health
```

Response:
```json
{
  "status": "ok",
  "service": "standby-scheduler",
  "timestamp": "2026-01-15T10:00:00.000Z"
}
```

---

## 🧪 Testing

### Test 1: Check Service Status

Di Render Dashboard → standby-scheduler → Status harus **"Live"** (hijau)

### Test 2: Wait for Scheduled Email

- **17:00 WIB**: Cek inbox developer yang stand by besok
- **06:00 WIB**: Cek inbox developer yang stand by hari ini

### Test 3: Manual Test (Optional)

Kalo mau test sebelum scheduled time:

1. Di Render Dashboard → Shell tab
2. Run:
   ```bash
   bun run test:email
   ```

---

## 📊 Monitoring & Maintenance

### Check Logs

Render Dashboard → standby-scheduler → Logs tab

Filter logs:
- Error logs: Search "❌" or "Error"
- Success: Search "✅"

### Update Schedule

Kalo mau update jadwal:

1. Edit `src/server/index.ts` locally
2. Commit & push ke GitHub:
   ```bash
   git add .
   git commit -m "Update schedule"
   git push origin main
   ```
3. Render **auto-redeploy** dalam 1-2 menit

### Update Developer Emails

1. Render Dashboard → standby-scheduler
2. Go to **"Environment"** tab
3. Edit environment variable yang mau diubah
4. Click **"Save Changes"**
5. Service akan auto-restart

### Free Tier Limits

Render Free tier:
- **750 jam/bulan** (31 hari × 24 jam = 744 jam)
- Cukup buat 24/7 operation!
- Kalo lebih, service akan di-suspend sampe bulan depan

Check usage:
- Render Dashboard → Account Settings → Usage

---

## 🔧 Troubleshooting

### ❌ Email ga terkirim?

**Check Logs:**
```
Render Dashboard → Logs
```

Look for:
```
❌ Failed to send email to xxx@example.com
```

**Possible causes:**
1. Email credentials salah → Check `EMAIL_USER` dan `EMAIL_PASSWORD`
2. App password salah → Regenerate di https://myaccount.google.com/apppasswords
3. Developer email ga valid → Check `EMAIL_*` variables

**Fix:**
1. Update environment variables di Render
2. Service akan auto-restart

### ❌ Service keeps crashing?

**Check Logs** untuk error message.

Common issues:
1. Missing environment variables
2. Invalid email config
3. Timezone issue

**Fix:**
1. Pastikan semua required env vars ada
2. Verify `TZ=Asia/Jakarta`
3. Manual restart: Render Dashboard → Settings → Restart Service

### ❌ Build failed?

**Check build logs:**

Common issues:
1. `bun.lock` file missing → Commit `bun.lock` to repo
2. Dependency error → Run `bun install` locally, commit changes

### 🐌 Service slow to wake up?

Render free tier has **cold start** - service sleep after 15 menit idle.

**NOT A PROBLEM** untuk scheduler kita karena:
- Cron job jalan internal
- Health check endpoint keep service awake
- Render ping health check every ~5 menit

---

## 🔄 Auto-Deploy

Setiap kali lu push ke GitHub `main` branch, Render otomatis:
1. Pull latest code
2. Rebuild Docker image
3. Restart service dengan kode baru

**No manual action needed!**

---

## 💰 Cost

**FREE** - $0/month

Free tier includes:
- 750 jam/bulan
- Shared CPU & memory
- Auto SSL/HTTPS
- Custom domain (optional)

Kalo butuh upgrade (TIDAK PERLU buat use case ini):
- Starter: $7/month (upgrade kalo mau always-on guaranteed)

---

## 📝 Next Steps

1. ✅ Service deployed & running
2. ✅ Email scheduler active
3. ✅ Auto-deploy configured
4. ⏰ Wait for 17:00 WIB atau 06:00 WIB
5. 📧 Verify email received

---

## 🆘 Support

**Render Documentation:**
- https://render.com/docs

**Scheduler Issue?**
- Check `DEPLOYMENT_CHECKLIST.md`
- Check `EMAIL_SETUP.md`

**Need Help?**
- Render Community: https://community.render.com
- Render Status: https://status.render.com

---

**Good luck! 🚀**

Scheduler sekarang jalan 24/7 di cloud, ga perlu laptop nyala lagi!
