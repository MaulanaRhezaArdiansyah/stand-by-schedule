# ✅ Deployment Checklist

Quick checklist sebelum jalanin scheduler di laptop.

---

## 📋 Pre-Deployment Checklist

### 1. Code Ready
- [x] Web app (monthly calendar) - done
- [x] Email scheduler - done
- [x] Email templates - done
- [x] Developer emails via env vars - done

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

## 🚀 Start Scheduler

### Simple Method (Recommended)

```bash
# Open terminal
cd C:\typescript\stand-by-schedule
bun run scheduler
```

**Expected output:**
```
🚀 Starting Stand By Email Scheduler...
✅ Email configuration verified
✅ Loaded 1 month(s) of schedules
✅ Email scheduler is running!
```

**Minimize terminal (jangan close!)**

---

## 🧪 Testing

### Test 1: Verify Scheduler Running

Terminal output shows:
- ✅ Email configuration verified
- ✅ Loaded schedules
- ✅ Email scheduler is running

### Test 2: Manual Test Email

Open terminal baru:
```bash
cd C:\typescript\stand-by-schedule
bun run test:email
```
Check inbox untuk test email.

### Test 3: Wait for Schedule
- 17:00 WIB: H-1 reminder sent
- 06:00 WIB: H reminder sent

---

## 📊 Monitoring

### Check Scheduler Status

1. Look at terminal window
2. Should see "Email scheduler is running!"
3. No error messages

### Update Schedule

1. Edit `src/server/index.ts`
2. Update `monthlySchedules` array
3. Stop scheduler (Ctrl+C)
4. Start again: `bun run scheduler`

### Update Developer Emails

1. Edit `.env` file
2. Stop scheduler (Ctrl+C)
3. Start again: `bun run scheduler`

---

## 🔧 Troubleshooting

### Email ga terkirim?
1. Check terminal for errors
2. Verify `.env` file complete
3. Check EMAIL_PASSWORD (app-specific password)
4. Test manual: `bun run test:email`

### Scheduler stopped?
- Terminal closed → Re-open and run `bun run scheduler`
- Laptop sleep → Disable sleep in Power settings
- Internet down → Check connection

### Port 10000 conflict?
Edit `src/server/index.ts`:
```typescript
const PORT = process.env.PORT || 10001
```

---

## ✅ Post-Deployment

- [ ] Scheduler running (check terminal)
- [ ] Verify email config valid (no errors in terminal)
- [ ] Update all developer emails di `.env`
- [ ] Test email delivery (manual test or wait for schedule)
- [ ] Keep laptop awake settings configured

---

## 💰 Cost

**FREE** - $0/month

Requirements:
- Laptop nyala 24/7
- Stable internet
- ~50MB RAM (very light!)

---

## 💡 Quick Commands

```bash
# Start scheduler
bun run scheduler

# Stop scheduler
Ctrl+C (in scheduler terminal)

# Test email
bun run test:email

# Check dev mode (with auto-reload)
bun run scheduler:dev
```

---

## 🎯 Keep Laptop Awake

**Windows Settings:**
1. Settings → Power & Sleep
2. Screen: 15 minutes
3. Sleep: **Never**

---

**Full Guide**: [START.md](./START.md)

Good luck! 🚀

Scheduler jalan ringan, tinggal minimize terminal!
