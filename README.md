# 📋 Stand By Schedule System

Automated email reminder system for weekend stand-by schedules with monthly calendar view.

## 🎯 Features

### 📅 Monthly Schedule Calendar
- Interactive table view with editable cells
- Color-coded roles (Front Office, Middle Office, Back Office)
- Notes and reminders sidebar
- Responsive design with glassmorphism theme

### 📧 Automated Email Reminders
- **H-1 Reminder**: Sent at 17:00 WIB (day before stand-by)
- **H Reminder**: Sent at 06:00 WIB (stand-by day)
- Beautiful HTML email templates
- Timezone-aware scheduling (Asia/Jakarta)

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
bun install

# Run web app (calendar view)
bun run dev

# Run email scheduler
bun run scheduler

# Test email sending
bun run test:email
```

### Check Scheduler Status

```bash
# Check if scheduler is running
bun run scheduler:check

# Stop scheduler
bun run scheduler:stop
```

---

## 📦 Deployment

### Simple Method: Keep Terminal Open (Recommended)

**Paling simple & ringan!**

```bash
cd C:\typescript\stand-by-schedule
bun run scheduler
```

- Minimize terminal (jangan close!)
- Keep laptop awake & connected to internet
- ~50MB RAM usage only

See [START.md](./START.md) for complete guide.

---

**Optional:** Auto-start on boot
1. Press Win+R
2. Type: `shell:startup`
3. Copy `start-scheduler.bat` to Startup folder

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Stand By Scheduler <your-email@gmail.com>
TZ=Asia/Jakarta
```

### Developer Email Mapping

Add email variables to `.env` file:

```env
# Developer Emails
EMAIL_DIRGA=dirga@company.com
EMAIL_HILMI=hilmi@company.com
EMAIL_ARDAN=ardan@company.com
# ... add all developers (see .env.example for complete list)
```

Emails are loaded from environment variables via `src/config/developerEmails.ts`

### Schedule Data

Edit `src/server/index.ts` to update monthly schedules:

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

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Run web app development server |
| `bun run build` | Build web app for production |
| `bun run scheduler` | Start email scheduler |
| `bun run scheduler:dev` | Start scheduler with auto-reload |
| `bun run scheduler:check` | Check scheduler status |
| `bun run scheduler:stop` | Stop all schedulers |
| `bun run test:email` | Send test emails |

---

## 🏗️ Project Structure

```
stand-by-schedule/
├── src/
│   ├── App.tsx                    # React calendar view
│   ├── config/
│   │   └── developerEmails.ts     # Email mapping
│   ├── services/
│   │   ├── emailService.ts        # SMTP configuration
│   │   ├── emailTemplates.ts      # HTML email templates
│   │   └── scheduler.ts           # Cron job scheduler
│   ├── server/
│   │   └── index.ts               # Scheduler entry point
│   └── test-email.ts              # Email testing script
├── scripts/
│   ├── check-scheduler.ps1        # Status checker
│   └── stop-scheduler.ps1         # Stop script
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
├── railway.json                   # Railway config
├── nixpacks.toml                  # Railway build config
└── package.json                   # Dependencies & scripts
```

---

## 📧 Email Templates

### H-1 Reminder (Yellow Theme)
- Subject: "Reminder: Stand By Besok"
- Sent: 17:00 WIB (day before)
- Content: Schedule info, role, time, HRIS reminder

### H Reminder (Red Theme)
- Subject: "Stand By Hari Ini - Jam 06.00"
- Sent: 06:00 WIB (stand-by day)
- Content: Urgent alert, checklist, HRIS reminder

---

## 🔧 Troubleshooting

### Email not sending?
1. Check `.env` file - verify EMAIL_USER and EMAIL_PASSWORD
2. For Gmail: Use app-specific password (not regular password)
3. Check logs: `bun run scheduler` output
4. Test manually: `bun run test:email`

### Scheduler not running?
1. Check status: `bun run scheduler:check`
2. Check timezone: `TZ=Asia/Jakarta` in `.env`
3. Check Railway logs (if deployed)

### Railway deployment issues?
1. Check environment variables are set
2. Check logs in Railway dashboard
3. Verify build command: `bun install`
4. Verify start command: `bun run scheduler`

---

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Email Setup Guide](./EMAIL_SETUP.md)
- [Railway Deployment](./DEPLOY_RAILWAY.md)

---

## 🛡️ Tech Stack

- **Runtime**: Bun
- **Frontend**: React + TypeScript + Vite
- **Email**: Nodemailer
- **Scheduler**: node-cron
- **Deployment**: Railway (or PM2 local)

---

## 📄 License

MIT

---

**Built with ❤️ for dev team stand-by scheduling**
