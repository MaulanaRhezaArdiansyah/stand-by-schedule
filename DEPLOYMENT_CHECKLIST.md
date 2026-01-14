# ✅ PM2 Deployment Checklist

Quick checklist sebelum deploy dengan PM2 (laptop/server).

---

## 📋 Pre-Deployment Checklist

### 1. Code Ready
- [x] Web app (monthly calendar) - done
- [x] Email scheduler - done
- [x] Email templates - done
- [x] Developer emails via env vars - done
- [x] PM2 config file - done (ecosystem.config.js)

### 2. Environment Variables Ready
Pastikan `.env` file lu udah lengkap:

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

### Step 1: Install PM2

```bash
npm install -g pm2
```

Verify:
```bash
pm2 --version
```

### Step 2: Verify .env File

Pastikan `.env` file udah lengkap dengan semua variables dari checklist di atas.

### Step 3: Start with PM2

```bash
# Start scheduler
pm2 start ecosystem.config.js

# Check status
pm2 status
```

### Step 4: Save PM2 Config

```bash
# Save process list
pm2 save

# Setup auto-start on boot
pm2 startup
```

Run command yang dikasih PM2, lalu:
```bash
pm2 save
```

### Step 5: Verify

Check PM2 logs:

```
🚀 Starting Stand By Email Scheduler...
🏥 Health check server running on port 10000
✅ Email configuration verified
✅ Loaded 1 month(s) of schedules
✅ Email scheduler is running!
```

---

## 🧪 Testing After Deploy

### Test 1: Check PM2 Status
```bash
pm2 status
```
Status harus `online` (hijau)

### Test 2: Check Logs
```bash
pm2 logs standby-scheduler --lines 50
```
Verify:
- ✅ Email configuration verified
- ✅ Loaded schedules
- ✅ Email scheduler is running

### Test 3: Manual Test Email
```bash
bun run test:email
```
Check inbox untuk test email

### Test 4: Wait for Schedule
- Wait until 17:00 WIB or 06:00 WIB
- Check developer inbox
- Verify email received

---

## 📊 Monitoring

### Check Status
```bash
pm2 status
```
Status harus `online` dengan uptime yang naik

### Real-time Monitoring
```bash
pm2 monit
```
Shows CPU, memory usage, logs

### Update Schedule
Kalo mau update schedule:
1. Edit `src/server/index.ts` locally
2. Reload PM2:
   ```bash
   pm2 reload standby-scheduler
   ```

---

## 🔧 Troubleshooting

### Email ga terkirim?
```bash
pm2 logs standby-scheduler --lines 100 | grep -i error
```
1. Verify `.env` file complete
2. Check EMAIL_PASSWORD (app-specific password)
3. Test manual: `bun run test:email`

### Scheduler ga jalan?
```bash
pm2 status
```
If status `errored`:
```bash
pm2 logs standby-scheduler --err
pm2 restart standby-scheduler
```

### PM2 ga auto-start?
```bash
pm2 unstartup
pm2 startup
# Run command yang dikasih
pm2 save
```

### Update developer emails?
1. Edit `.env` file
2. Reload PM2:
   ```bash
   pm2 reload standby-scheduler
   ```

---

## ✅ Post-Deployment

- [ ] PM2 status `online`
- [ ] Verify email config valid (check logs)
- [ ] PM2 auto-start configured (`pm2 startup` & `pm2 save`)
- [ ] Update all developer emails di `.env`
- [ ] Test email delivery (manual test or wait for schedule)
- [ ] Keep laptop awake settings configured

---

## 💰 Cost

**FREE** - $0/month

Requirements:
- Laptop/PC harus nyala 24/7
- Stable internet connection
- Electricity cost (kalo peduli 😅)

---

## 💡 PM2 Quick Commands

```bash
pm2 status                     # Check status
pm2 logs standby-scheduler     # View logs
pm2 monit                      # Real-time monitoring
pm2 restart standby-scheduler  # Restart
pm2 reload standby-scheduler   # Reload (zero-downtime)
pm2 stop standby-scheduler     # Stop
pm2 save                       # Save config
```

---

**Deployment Guide**: [DEPLOY_PM2.md](./DEPLOY_PM2.md)

Good luck! 🚀

Scheduler jalan 24/7 di laptop lu (selama laptop nyala)!
