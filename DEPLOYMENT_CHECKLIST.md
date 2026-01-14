# ✅ Render.com Deployment Checklist

Quick checklist sebelum deploy ke Render.com (FREE, NO CREDIT CARD).

---

## 📋 Pre-Deployment Checklist

### 1. Code Ready
- [x] Web app (monthly calendar) - done
- [x] Email scheduler - done
- [x] Email templates - done
- [x] Developer emails via env vars - done
- [x] Render config files - done (Dockerfile, render.yaml)

### 2. Environment Variables Ready
Pastikan lu punya semua values ini buat Render:

```env
# Email Configuration (REQUIRED)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<your-gmail>
EMAIL_PASSWORD=<your-app-password>
EMAIL_FROM=Stand By Scheduler <<your-gmail>>
EMAIL_SUBJECT_H1=Reminder: Stand By Besok
EMAIL_SUBJECT_H=Stand By Hari Ini - Jam 06.00
TZ=Asia/Jakarta

# Developer Emails (ADD ALL)
EMAIL_DIRGA=<email>
EMAIL_HILMI=<email>
EMAIL_ARDAN=<email>
EMAIL_ALAWI=<email>
EMAIL_FARHAN=<email>
EMAIL_RHEZA=<email>
EMAIL_VIGO=<email>
EMAIL_RINE=<email>
EMAIL_IRA=<email>
EMAIL_MIFTAH=<email>
EMAIL_MAULANA=<email>
EMAIL_CHABIB=<email>
EMAIL_NEZA=<email>
```

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Render Setup

1. Go to https://render.com
2. Sign up with **GitHub** (NO CREDIT CARD NEEDED!)
3. Click **"New +"** → **"Web Service"**
4. Select `stand-by-schedule` repo
5. Render auto-detects Docker (from Dockerfile)

### Step 3: Configure Service

```
Name: standby-scheduler
Region: Singapore
Branch: main
Runtime: Docker
Instance Type: Free
```

### Step 4: Set Environment Variables

Di service configuration page → **Environment Variables**:

**Add semua environment variables dari checklist di atas**

⚠️ IMPORTANT:
- Jangan pake quotes
- Ganti semua `<placeholder>` dengan value yang bener
- Pastikan semua developer email udah diisi

### Step 5: Deploy

Click **"Create Web Service"** button.

Render akan:
1. Clone repo
2. Build Docker image with Bun
3. Run `bun install`
4. Run `bun run src/server/index.ts`

Build akan makan waktu ~2-3 menit.

### Step 6: Verify

Check Render Logs, harusnya liat:

```
🚀 Starting Stand By Email Scheduler...
🏥 Health check server running on port 10000
✅ Email configuration verified
✅ Loaded 1 month(s) of schedules
✅ Email scheduler is running!
```

---

## 🧪 Testing After Deploy

### Test 1: Check Logs
- Render Dashboard → standby-scheduler → **Logs** tab
- Verify no errors
- Verify "Email scheduler is running!"

### Test 2: Check Health Endpoint
- Render akan kasih URL (e.g., `https://standby-scheduler-xxx.onrender.com`)
- Test: `curl https://your-url.onrender.com/health`
- Response: `{"status":"ok","service":"standby-scheduler"}`

### Test 3: Wait for Schedule
- Wait until 17:00 WIB or 06:00 WIB
- Check developer inbox
- Verify email received

### Test 4: Manual Test (Optional)
Via Render Shell:
```bash
bun run test:email
```

---

## 📊 Monitoring

### Check Status
Render Dashboard → standby-scheduler
- Status should be **"Live"** (hijau)

### Check Usage
Render Dashboard → Account Settings → Usage
- Free tier: 750 jam/bulan (cukup buat 24/7!)
- Monitor usage biar ga over limit

### Update Schedule
Kalo mau update schedule:
1. Edit `src/server/index.ts` locally
2. Commit & push
3. Render **auto-redeploy** dalam 1-2 menit

---

## 🔧 Troubleshooting

### Email ga terkirim?
1. Check Render logs for errors
2. Verify all environment variables set correctly
3. Check EMAIL_PASSWORD (app-specific password, not regular password)
4. Test manual: `bun run test:email` locally

### Scheduler ga jalan?
1. Check Render logs
2. Verify TZ=Asia/Jakarta
3. Manual restart: Render → Settings → Restart Service

### Service keeps crashing?
1. Check logs untuk error message
2. Verify semua required env vars ada
3. Check email config valid

### Update developer emails?
1. Render Dashboard → standby-scheduler → **Environment** tab
2. Update EMAIL_* variables
3. Click **"Save Changes"** → auto-restart

---

## ✅ Post-Deployment

- [ ] Verify scheduler running (status "Live")
- [ ] Verify email config valid (check logs)
- [ ] Test health endpoint
- [ ] Update all developer emails
- [ ] Test email delivery (wait for scheduled time or run manual test)
- [ ] Monitor Render usage (should be < 750 jam/bulan)

---

## 💰 Cost

**FREE** - $0/month

Free tier includes:
- 750 jam/bulan (perfect untuk 24/7 scheduler!)
- Auto SSL/HTTPS
- Auto-deploy dari GitHub
- **NO CREDIT CARD** required

---

**Deployment Guide**: [DEPLOY_RENDER.md](./DEPLOY_RENDER.md)

Good luck! 🚀

Scheduler sekarang jalan 24/7 di cloud, ga perlu laptop nyala lagi!
