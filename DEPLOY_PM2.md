# 🚀 Deploy dengan PM2 - Stand By Scheduler

Guide lengkap setup PM2 buat jalanin email scheduler 24/7 di laptop/server.

---

## 🎯 Kenapa PM2?

- ✅ **FREE** - 100% gratis
- ✅ **Simple** - Easy setup
- ✅ **Auto-restart** - Kalo crash, otomatis restart
- ✅ **Startup script** - Auto-start pas laptop nyala
- ⚠️ **Butuh laptop nyala** - Scheduler cuma jalan pas laptop/PC on

---

## 📋 Prerequisites

1. **Bun** installed
2. **PM2** installed globally
3. **Project** udah ready

---

## 🚀 Setup PM2

### Step 1: Install PM2

```bash
npm install -g pm2
```

Verify installation:
```bash
pm2 --version
```

### Step 2: Setup Environment Variables

Pastikan `.env` file udah lengkap:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Stand By Scheduler <your-email@gmail.com>
EMAIL_SUBJECT_H1=Reminder: Stand By Besok
EMAIL_SUBJECT_H=Stand By Hari Ini - Jam 06.00
TZ=Asia/Jakarta

# Developer Emails (UPDATE SEMUA!)
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

### Step 3: Create PM2 Ecosystem File

Buat file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'standby-scheduler',
    script: 'bun',
    args: 'run src/server/index.ts',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      TZ: 'Asia/Jakarta'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
```

### Step 4: Start Scheduler with PM2

```bash
# Start scheduler
pm2 start ecosystem.config.js

# Verify running
pm2 status
```

Expected output:
```
┌─────┬────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name               │ status  │ restart │ uptime   │
├─────┼────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ standby-scheduler  │ online  │ 0       │ 0s       │
└─────┴────────────────────┴─────────┴─────────┴──────────┘
```

### Step 5: Check Logs

```bash
# View logs
pm2 logs standby-scheduler

# View last 50 lines
pm2 logs standby-scheduler --lines 50
```

Expected logs:
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

### Step 6: Save PM2 Configuration

```bash
# Save current process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

PM2 akan kasih command, copy-paste dan run command tersebut.

Example output:
```
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username
```

Run command yang dikasih PM2, lalu save lagi:
```bash
pm2 save
```

---

## 📊 PM2 Commands

### Monitor Scheduler

```bash
# Real-time monitoring
pm2 monit

# Status check
pm2 status

# Detailed info
pm2 info standby-scheduler
```

### Manage Process

```bash
# Restart scheduler
pm2 restart standby-scheduler

# Stop scheduler
pm2 stop standby-scheduler

# Delete from PM2
pm2 delete standby-scheduler

# Reload (zero-downtime restart)
pm2 reload standby-scheduler
```

### View Logs

```bash
# Live logs
pm2 logs standby-scheduler

# Only errors
pm2 logs standby-scheduler --err

# Clear logs
pm2 flush
```

---

## 🧪 Testing

### Test 1: Check PM2 Status

```bash
pm2 status
```

Status harus `online` (hijau).

### Test 2: Check Logs

```bash
pm2 logs standby-scheduler --lines 20
```

Verify:
- ✅ Email configuration verified
- ✅ Loaded schedules
- ✅ Email scheduler is running

### Test 3: Test Email Manually

```bash
bun run test:email
```

Check inbox untuk test email.

### Test 4: Wait for Scheduled Time

- **17:00 WIB**: Developer yang stand by besok akan dapat email H-1
- **06:00 WIB**: Developer yang stand by hari ini akan dapat email H

---

## 🔄 Update Schedule

Kalo mau update jadwal:

### Step 1: Edit Schedule

Edit `src/server/index.ts`:

```typescript
const monthlySchedules = [
  {
    month: 'Februari',
    year: 2026,
    schedules: [
      { date: 1, day: 'Sabtu', frontOffice: 'Dirga', middleOffice: 'Alawi', backOffice: 'Rine' },
      // ... add more
    ]
  }
]
```

### Step 2: Reload PM2

```bash
pm2 reload standby-scheduler
```

Scheduler akan restart dengan kode baru, zero downtime!

---

## 🔧 Troubleshooting

### ❌ Scheduler ga jalan?

**Check PM2 status:**
```bash
pm2 status
```

If status `errored`:
```bash
pm2 logs standby-scheduler --err --lines 50
```

**Common issues:**
1. `.env` file ga ada atau incomplete
2. Email credentials salah
3. Port 10000 udah kepake

**Fix:**
1. Verify `.env` file ada dan complete
2. Test email config: `bun run test:email`
3. Change port di `src/server/index.ts`

### ❌ PM2 ga auto-start pas reboot?

**Re-setup startup script:**
```bash
pm2 unstartup
pm2 startup
# Run command yang dikasih
pm2 save
```

### ❌ Email ga terkirim?

**Check logs:**
```bash
pm2 logs standby-scheduler --lines 100 | grep -i error
```

**Verify email config:**
1. Check `EMAIL_USER` and `EMAIL_PASSWORD` di `.env`
2. Pastikan pake app password (bukan password biasa)
3. Test manual: `bun run test:email`

### ❌ Memory leak / High memory usage?

**Check memory:**
```bash
pm2 status
```

If memory > 200MB, PM2 akan auto-restart (configured di ecosystem.config.js).

**Manual restart:**
```bash
pm2 reload standby-scheduler
```

---

## 💡 Tips & Best Practices

### 1. Monitor Logs Regularly

```bash
# Check logs setiap hari
pm2 logs standby-scheduler --lines 50
```

### 2. Backup Configuration

```bash
# Backup PM2 config
pm2 save

# Export to file
pm2 save > pm2-backup.json
```

### 3. Log Rotation

Install PM2 log rotate module:
```bash
pm2 install pm2-logrotate

# Configure (optional)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 4. Keep Laptop Awake

**Windows:**
- Settings → Power & Sleep → Screen: Never, Sleep: Never

**Mac:**
```bash
caffeinate -d
```

**Linux:**
```bash
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

---

## 📝 Maintenance

### Weekly Tasks

1. **Check PM2 status:**
   ```bash
   pm2 status
   ```

2. **Check logs untuk errors:**
   ```bash
   pm2 logs standby-scheduler --err --lines 50
   ```

3. **Verify email delivery** - Ask developers kalo mereka terima email

### Monthly Tasks

1. **Update schedule** untuk bulan depan di `src/server/index.ts`
2. **Reload PM2:**
   ```bash
   pm2 reload standby-scheduler
   ```

3. **Update developer emails** kalo ada perubahan di `.env`

---

## ⚠️ Important Notes

1. **Laptop harus nyala 24/7** - PM2 ga bisa jalan kalo laptop mati
2. **Backup `.env` file** - Jangan sampe kehilangan email credentials
3. **Monitor disk space** - Logs bisa numpuk kalo ga di-rotate
4. **Stable internet** - Email butuh koneksi internet buat kirim

---

## 🆘 Need Help?

**PM2 Documentation:**
- https://pm2.keymetrics.io/docs/usage/quick-start/

**PM2 Commands Cheatsheet:**
```bash
pm2 start ecosystem.config.js  # Start
pm2 stop standby-scheduler     # Stop
pm2 restart standby-scheduler  # Restart
pm2 reload standby-scheduler   # Reload (zero-downtime)
pm2 delete standby-scheduler   # Remove
pm2 logs standby-scheduler     # View logs
pm2 monit                      # Monitor
pm2 status                     # Status
pm2 save                       # Save config
```

---

**Good luck! 🚀**

Scheduler sekarang jalan 24/7 di laptop lu (selama laptop nyala)!
