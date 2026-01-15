# 📋 Setup Summary - Stand By Scheduler

Complete project setup dengan Windows Task Scheduler support.

---

## 🎯 Features

### 📧 Email Reminders

1. **H-1 Stand By Reminder** (17:00 WIB daily)
   - Sent to: FO, MO, BO developers yang stand by besok
   - Theme: Yellow/orange warning

2. **H Stand By Reminder** (06:00 WIB daily)
   - Sent to: FO, MO, BO developers yang stand by hari ini
   - Theme: Red urgent

3. **Hourly Team Check** (Mon-Fri, 08:00-17:00 WIB)
   - Sent to: Team Leads (Alawi, Miftah, Dirga)
   - Content: Reminder untuk check Hotfix, Need Condition, Todo, In Progress tasks
   - Theme: Blue professional

---

## 🚀 Quick Start Options

### Option 1: Windows Task Scheduler (RECOMMENDED) ⭐

**One-time setup:**
1. Right-click `install-task-scheduler.bat` → Run as Administrator
2. Done! Task auto-starts on boot

**Requirements:**
- Admin privileges only (no external tools needed!)

**Benefits:**
- ✅ Auto-start on boot
- ✅ Runs in background
- ✅ Built-in Windows (ga perlu install apa-apa)
- ✅ Simple & reliable

See: [TASK_SCHEDULER.md](./TASK_SCHEDULER.md)

### Option 2: Manual Run

```bash
bun run scheduler
```

Keep terminal open, minimize. Stop with Ctrl+C.

See: [START.md](./START.md)

---

## 📁 Project Structure

```
stand-by-schedule/
├── src/
│   ├── server/
│   │   └── index.ts              # Main scheduler entry point
│   ├── services/
│   │   ├── scheduler.ts          # Cron job scheduling
│   │   ├── emailService.ts       # SMTP email sending
│   │   └── emailTemplates.ts     # HTML email templates
│   ├── config/
│   │   └── developerEmails.ts    # Email mapping (env vars)
│   ├── test-email.ts             # Test stand-by reminders
│   └── test-hourly-email.ts      # Test hourly reminders
├── logs/                         # Service logs (auto-created)
├── .env                          # Environment variables
├── install-task-scheduler.bat    # Task Scheduler installer
├── uninstall-task-scheduler.bat  # Task Scheduler uninstaller
├── start-scheduler.bat           # Manual start script
├── TASK_SCHEDULER.md             # Task Scheduler setup guide
├── START.md                      # Quick start guide
└── DEPLOYMENT_CHECKLIST.md       # Deployment checklist
```

---

## ⚙️ Configuration

### Environment Variables (.env)

**Email SMTP:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Stand By Scheduler <your-email@gmail.com>
TZ=Asia/Jakarta
```

**Developer Emails (13 total):**
```env
EMAIL_DIRGA=astya444@gmail.com
EMAIL_HILMI=mhhidayat811@gmail.com
EMAIL_ARDAN=ardan@example.com
EMAIL_ALAWI=rizkyalawy39@gmail.com
EMAIL_FARHAN=farhan18042002@gmail.com
EMAIL_RHEZA=maulanarhezaardiansyah2000@gmail.com
EMAIL_VIGO=vigoalmuarif@gmail.com
EMAIL_RINE=rinealfi.09@gmail.com
EMAIL_IRA=irastrahayu@gmail.com
EMAIL_MIFTAH=miftahfaizh@gmail.com
EMAIL_MAULANA=asyifamaulana1412@gmail.com
EMAIL_CHABIB=chabib@example.com
EMAIL_NEZA=neza@example.com
```

### Schedule Data (src/server/index.ts)

```typescript
const monthlySchedules = [
  {
    month: 'Januari',
    year: 2026,
    schedules: [
      { date: 3, day: 'Sabtu', frontOffice: 'Dirga', middleOffice: 'Alawi', backOffice: 'Rine' },
      // ... add more dates
    ]
  }
]
```

---

## 🧪 Testing

```bash
# Test stand-by reminders (H-1 & H)
bun run test:email

# Test hourly team reminder
bun run test:hourly

# Run scheduler in dev mode (auto-reload)
bun run scheduler:dev
```

---

## 📊 Monitoring

### Task Scheduler

```powershell
# Check status
schtasks /query /tn "StandByScheduler"

# Check if Bun process running
tasklist | findstr bun.exe

# Start task
schtasks /run /tn "StandByScheduler"

# Stop task (kill process)
taskkill /f /im bun.exe
```

### Manual Run

Just check terminal output.

---

## 🔄 Updates & Maintenance

### Update Schedule

1. Edit `src/server/index.ts` → update `monthlySchedules` array
2. Restart task:
   ```powershell
   taskkill /f /im bun.exe
   schtasks /run /tn "StandByScheduler"
   ```

### Update Developer Emails

1. Edit `.env` file
2. Restart task:
   ```powershell
   taskkill /f /im bun.exe
   schtasks /run /tn "StandByScheduler"
   ```

### Update Code

1. Make changes
2. Restart task:
   ```powershell
   taskkill /f /im bun.exe
   schtasks /run /tn "StandByScheduler"
   ```

---

## 📧 Email Schedule Summary

| Time | Type | Recipients | Frequency |
|------|------|-----------|-----------|
| **17:00 WIB** | H-1 Stand By | FO, MO, BO on duty tomorrow | Daily |
| **06:00 WIB** | H Stand By | FO, MO, BO on duty today | Daily |
| **08:00-17:00 WIB** | Hourly Team Check | Alawi, Miftah, Dirga (Team Leads) | Hourly, Mon-Fri |

---

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Framework**: React + TypeScript (frontend)
- **Email**: Nodemailer (SMTP)
- **Scheduling**: node-cron
- **Windows Automation**: Task Scheduler (built-in)
- **Timezone**: Asia/Jakarta

---

## 💡 Tips

1. **Always use Task Scheduler for production** - most reliable
2. **Test emails before deploy** - `bun run test:email` dan `bun run test:hourly`
3. **Monitor task regularly** - `schtasks /query /tn "StandByScheduler"`
4. **Keep .env updated** - especially when developers change
5. **Verify task after reboot** - `tasklist | findstr bun.exe`

---

## 🆘 Troubleshooting

### Task won't start
- Check task status: `schtasks /query /tn "StandByScheduler" /fo list`
- Verify .env file complete
- Check email credentials valid
- Check Event Viewer: `eventvwr.msc` → Windows Logs → Application

### Emails not sending
- Test manually: `bun run test:email`
- Check EMAIL_PASSWORD (must be app password, not regular password)
- Verify internet connection

### Port 10000 conflict
- Edit `src/server/index.ts`
- Change `const PORT = 10000` to different port
- Restart task:
  ```powershell
  taskkill /f /im bun.exe
  schtasks /run /tn "StandByScheduler"
  ```

---

## 📚 Documentation

- **Quick Start**: [START.md](./START.md)
- **Task Scheduler**: [TASK_SCHEDULER.md](./TASK_SCHEDULER.md)
- **Deployment**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Project README**: [README.md](./README.md)

---

**Setup complete! Task ready to run 24/7! 🎉**
