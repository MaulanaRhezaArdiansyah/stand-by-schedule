# 🚀 Quick Start - Stand By Scheduler

Simple guide buat jalanin email scheduler di laptop lu.

---

## ✅ Prerequisites

1. ✅ Bun installed
2. ✅ `.env` file lengkap (semua email developer udah diisi)
3. ✅ Laptop connected to internet

---

## 🚀 Start Scheduler

### Option 1: Windows Task Scheduler (BEST - Auto-start!)

Install sebagai Windows Task - **auto-start pas laptop nyala, ga perlu terminal!**

**Right-click** `install-task-scheduler.bat` → **Run as Administrator**

See full guide: [TASK_SCHEDULER.md](./TASK_SCHEDULER.md)

**Keunggulan:**
- ✅ Auto-start on boot
- ✅ Runs in background (no terminal)
- ✅ Built-in Windows (ga perlu install apa-apa)
- ✅ Simple & reliable

---

### Option 2: Via Terminal (Simple)

Buka terminal baru dan run:

```bash
cd C:\typescript\stand-by-schedule
bun run scheduler
```

**Output yang diharapkan:**
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

**✅ DONE!** Scheduler udah jalan.

- **Minimize terminal** (jangan close!)
- Keep laptop nyala & connected to internet
- Email otomatis terkirim sesuai jadwal

---

### Option 3: Double-click BAT file

1. Double-click `start-scheduler.bat`
2. Terminal window akan muncul
3. Minimize aja (jangan close!)

---

## 🛑 Stop Scheduler

Di terminal yang jalan scheduler:
- Press **Ctrl+C**
- Wait sampai muncul "Stopping schedulers..."
- Terminal bisa di-close

---

## 📧 Test Email

Sebelum nunggu scheduled time, test dulu:

```bash
# Buka terminal baru (jangan yang scheduler!)
cd C:\typescript\stand-by-schedule
bun run test:email
```

Check inbox lu, harusnya ada 2 test emails (H-1 & H).

---

## 📅 Schedule Behavior

### Daily at 17:00 WIB (5 PM)
- Cek apakah **besok** ada yang stand by
- Kirim **H-1 reminder** (yellow theme) ke:
  - Front Office developer
  - Middle Office developer
  - Back Office developer

### Daily at 06:00 WIB (6 AM)
- Cek apakah **hari ini** ada yang stand by
- Kirim **H reminder** (red theme) ke:
  - Front Office developer
  - Middle Office developer
  - Back Office developer

---

## 🔄 Update Schedule

Edit jadwal untuk bulan baru:

1. Open `src/server/index.ts`
2. Update `monthlySchedules` array:
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
3. Save file
4. **Restart scheduler:**
   - Stop (Ctrl+C di terminal scheduler)
   - Start lagi: `bun run scheduler`

---

## 🔄 Update Developer Emails

Kalo ada developer baru/ganti email:

1. Edit `.env` file
2. Update email yang berubah:
   ```env
   EMAIL_DIRGA=newemail@company.com
   ```
3. Save file
4. **Restart scheduler:**
   - Stop (Ctrl+C)
   - Start lagi: `bun run scheduler`

---

## 🧪 Troubleshooting

### ❌ Email ga terkirim?

1. **Check terminal** - ada error ga?
2. **Check `.env`** - EMAIL_USER dan EMAIL_PASSWORD benar?
3. **Test manual:**
   ```bash
   bun run test:email
   ```
4. **Verify Gmail app password** - bukan password biasa!
   Generate di: https://myaccount.google.com/apppasswords

### ❌ Scheduler berhenti sendiri?

- Laptop sleep/hibernate → Scheduler otomatis stop
- Terminal ke-close → Scheduler stop
- Internet mati → Email ga bisa kirim

**Fix:** Keep laptop awake & terminal open!

### ❌ Port 10000 udah dipake?

Edit `src/server/index.ts`:
```typescript
const PORT = process.env.PORT || 10001  // Ganti ke port lain
```

---

## 💡 Tips

### Keep Laptop Awake (Windows)

**Settings → Power & Sleep:**
- Screen: 15 minutes (biar ga boros listrik)
- Sleep: **Never**

### Startup on Boot (Optional)

Biar auto-start pas laptop nyala:

1. Press **Win+R**
2. Type: `shell:startup`
3. Copy `start-scheduler.bat` ke folder Startup
4. Done! Scheduler auto-start pas login

⚠️ **IMPORTANT:** Pastikan `.env` file ada dan benar sebelum auto-start!

### Monitor Terminal

Kalo mau cek scheduler masih jalan:
- Check terminal window masih ada
- Look for: "Email scheduler is running!"
- No error messages

---

## 📊 What's Running?

Scheduler aktif:
- ✅ HTTP health server (port 10000)
- ✅ H-1 cron job (17:00 WIB daily)
- ✅ H cron job (06:00 WIB daily)

Resource usage:
- ~50MB RAM (sangat ringan!)
- ~0% CPU (idle most of time)
- Spike saat kirim email (sebentar aja)

---

## 🆘 Need Help?

**Common Issues:**
- Email config → Check `.env` file
- Port conflict → Change PORT in `src/server/index.ts`
- Laptop sleep → Disable sleep in Power settings
- Terminal closed → Re-open and run `bun run scheduler`

**Documentation:**
- Environment setup: `.env.example`
- Email config: `EMAIL_SETUP.md`
- Quick start: `QUICK_START.md`

---

**That's it! Simple & lightweight! 🎉**

No PM2, no complex setup, just:
```bash
bun run scheduler
```

Keep terminal open, minimize, done! 🚀
