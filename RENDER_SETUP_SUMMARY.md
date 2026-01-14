# 📦 Render.com Setup Summary

Project siap deploy ke Render.com! Berikut summary lengkapnya.

---

## ✅ What's Ready

### 1. Configuration Files
- ✅ **Dockerfile** - Bun runtime with Alpine Linux
- ✅ **render.yaml** - Render service configuration
- ✅ **.dockerignore** - Optimized Docker build (exclude unnecessary files)
- ✅ **.gitignore** - Updated to exclude temp files

### 2. Health Check Endpoint
Updated `src/server/index.ts`:
- ✅ HTTP server on port 10000
- ✅ `/health` endpoint for Render health checks
- ✅ Graceful shutdown handling

### 3. Documentation
- ✅ **DEPLOY_RENDER.md** - Complete step-by-step deployment guide
- ✅ **DEPLOYMENT_CHECKLIST.md** - Updated for Render
- ✅ **README.md** - Already includes environment variable setup

### 4. Environment Variables
Semua configuration via env vars (ready for Render):
- Email configuration (SMTP)
- Developer emails (13 developers)
- Timezone (Asia/Jakarta)

---

## 🚀 Quick Start

### 1. Push ke GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Deploy ke Render
Follow guide lengkap di: **[DEPLOY_RENDER.md](./DEPLOY_RENDER.md)**

**Quick steps:**
1. Sign up di https://render.com (GitHub login, NO CC!)
2. New Web Service → Connect repo
3. Set environment variables (copy dari `.env`)
4. Click "Create Web Service"
5. Wait ~2-3 menit
6. ✅ Done!

---

## 📊 Why Render.com?

| Feature | Render.com | Railway.app |
|---------|-----------|-------------|
| **Free Tier** | ✅ 750 jam/bulan | ❌ Limited (kena limit) |
| **Credit Card** | ❌ NOT REQUIRED | ✅ Required |
| **Always-On** | ✅ Yes | ✅ Yes |
| **Auto-Deploy** | ✅ Yes | ✅ Yes |
| **Bun Support** | ✅ Via Docker | ✅ Native |
| **Setup** | Medium | Easy |

**Winner:** Render.com karena FREE & NO CC! 🎉

---

## 🏗️ Architecture

```
GitHub Repo
    ↓ (push)
Render.com
    ↓ (auto-deploy)
Docker Build (Bun + Alpine)
    ↓
Install Dependencies
    ↓
Start Scheduler (port 10000)
    ↓
┌─────────────────────────┐
│  HTTP Health Server     │ ← Render health check
│  /health endpoint       │
└─────────────────────────┘
┌─────────────────────────┐
│  Cron Scheduler         │
│  - 17:00 WIB (H-1)     │
│  - 06:00 WIB (H)       │
└─────────────────────────┘
    ↓
Send Emails via Gmail SMTP
    ↓
Developer Inbox ✅
```

---

## 📁 Project Structure

```
stand-by-schedule/
├── Dockerfile              # ← Bun Docker image
├── render.yaml             # ← Render config
├── .dockerignore           # ← Optimized build
├── src/
│   ├── server/
│   │   └── index.ts        # ← Main scheduler + health endpoint
│   ├── services/
│   │   ├── scheduler.ts    # ← Cron jobs
│   │   ├── emailService.ts # ← SMTP
│   │   └── emailTemplates.ts # ← HTML templates
│   └── config/
│       └── developerEmails.ts # ← Email mapping (from env vars)
├── DEPLOY_RENDER.md        # ← Deployment guide
└── DEPLOYMENT_CHECKLIST.md # ← Quick checklist
```

---

## 🔐 Environment Variables Required

**Email Configuration:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Stand By Scheduler <your-email@gmail.com>
EMAIL_SUBJECT_H1=Reminder: Stand By Besok
EMAIL_SUBJECT_H=Stand By Hari Ini - Jam 06.00
TZ=Asia/Jakarta
```

**Developer Emails (13 total):**
```
EMAIL_DIRGA, EMAIL_HILMI, EMAIL_ARDAN
EMAIL_ALAWI, EMAIL_FARHAN, EMAIL_RHEZA, EMAIL_VIGO
EMAIL_RINE, EMAIL_IRA, EMAIL_MIFTAH, EMAIL_MAULANA
EMAIL_CHABIB, EMAIL_NEZA
```

Total: **22 environment variables**

---

## 💡 Tips

### Before Deploy:
1. ✅ Test locally: `bun run scheduler`
2. ✅ Test email: `bun run test:email`
3. ✅ Verify all env vars in `.env`
4. ✅ Commit & push to GitHub

### After Deploy:
1. ✅ Check Render logs → "Email scheduler is running!"
2. ✅ Test health: `curl https://your-url.onrender.com/health`
3. ✅ Monitor usage: Render Dashboard → Usage
4. ✅ Wait for scheduled time (17:00 or 06:00 WIB)

### Updates:
- **Update schedule**: Edit `src/server/index.ts`, commit, push → auto-redeploy
- **Update emails**: Render Dashboard → Environment → Edit → Save
- **Check logs**: Render Dashboard → Logs tab

---

## 🎯 Expected Behavior

### Daily at 17:00 WIB:
1. Scheduler checks tomorrow's date
2. Finds schedule in `monthlySchedules` array
3. Sends H-1 reminder email (yellow theme) to:
   - Front Office developer
   - Middle Office developer
   - Back Office developer

### Daily at 06:00 WIB:
1. Scheduler checks today's date
2. Finds schedule in `monthlySchedules` array
3. Sends H reminder email (red theme) to:
   - Front Office developer
   - Middle Office developer
   - Back Office developer

### Email Content:
- **H-1**: Yellow warning theme, "Stand By Besok"
- **H**: Red urgent theme, "Stand By Hari Ini - Jam 06.00"
- Both include: Date, Day, Role, Notes (if any)

---

## 💰 Cost Breakdown

**Render.com Free Tier:**
- 750 jam/bulan = 31.25 hari × 24 jam
- Scheduler kita butuh: 744 jam/bulan (31 hari × 24)
- **Margin**: 6 jam/bulan ✅

**Conclusion:** FREE, cukup banget! 🎉

---

## 🆘 Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| Email ga terkirim | Render logs | Verify env vars |
| Service crash | Logs → error message | Check email config |
| Build failed | Build logs | Check bun.lock committed |
| Slow to start | Normal | Render free tier has cold start |

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Project Docs**: [DEPLOY_RENDER.md](./DEPLOY_RENDER.md)

---

**Ready to deploy! 🚀**

Next step: Push ke GitHub, lalu ikutin guide di [DEPLOY_RENDER.md](./DEPLOY_RENDER.md)
