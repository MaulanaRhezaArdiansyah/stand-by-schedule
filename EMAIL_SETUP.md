# 📧 Email Scheduler Setup Guide

Panduan setup email scheduler untuk stand by reminder otomatis.

## 🎯 Fitur

- **H-1 Reminder**: Email dikirim jam 17:00 WIB sehari sebelum stand by
- **H Reminder**: Email dikirim jam 06:00 WIB di hari stand by
- **Email Template**: HTML template yang keren dengan design sesuai theme aplikasi

## 📋 Prerequisites

1. Email account (Gmail recommended)
2. App-specific password (untuk Gmail)

## 🔧 Setup Email Account

### Untuk Gmail:

1. **Enable 2-Factor Authentication**
   - Buka https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Buka https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → ketik "Stand By Scheduler"
   - Click "Generate"
   - Copy password yang muncul (16 karakter)

3. **Update .env file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=Stand By Scheduler <your-email@gmail.com>
   ```

### Untuk Email Provider Lain:

Update `.env` sesuai dengan SMTP settings provider lu:

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## 📝 Update Developer Emails

Edit file `src/config/developerEmails.ts`:

```typescript
export const developerEmails: Record<string, string> = {
  // Front Office
  'Dirga': 'dirga@company.com',
  'Hilmi': 'hilmi@company.com',
  'Ardan': 'ardan@company.com',

  // Middle Office
  'Alawi': 'alawi@company.com',
  'Farhan': 'farhan@company.com',
  'Rheza': 'rheza@company.com',
  'Vigo': 'vigo@company.com',

  // Back Office
  'Rine': 'rine@company.com',
  'Ira': 'ira@company.com',
  'Miftah': 'miftah@company.com',
  'Maulana': 'maulana@company.com',

  // Cadangan
  'Chabib': 'chabib@company.com',
  'Neza': 'neza@company.com',
}
```

## 🚀 Menjalankan Scheduler

### Production Mode:
```bash
bun run scheduler
```

### Development Mode (auto-reload on changes):
```bash
bun run scheduler:dev
```

### Output yang diharapkan:
```
🚀 Starting Stand By Email Scheduler...
==================================================

📧 Verifying email configuration...
✅ Email configuration verified

📅 Loading schedules data...
✅ Loaded 1 month(s) of schedules

⏰ Starting schedulers...
H-1 reminder scheduler started (runs daily at 17:00 WIB)
H reminder scheduler started (runs daily at 06:00 WIB)

==================================================
✅ Email scheduler is running!
📝 Schedule:
   - H-1 Reminder: Daily at 17:00 WIB (5 PM)
   - H Reminder:   Daily at 06:00 WIB (6 AM)

💡 Press Ctrl+C to stop the scheduler
==================================================
```

## 🧪 Testing Email

Untuk test email configuration tanpa nunggu scheduled time, lu bisa buat test script:

```typescript
// test-email.ts
import { sendEmail } from './src/services/emailService.js'
import { getH1ReminderTemplate } from './src/services/emailTemplates.js'

const testInfo = {
  date: 17,
  month: 'Januari',
  year: 2026,
  day: 'Sabtu',
  role: 'Front Office'
}

sendEmail({
  to: 'your-test-email@gmail.com',
  subject: 'Test Email - Stand By Reminder',
  html: getH1ReminderTemplate(testInfo)
})
```

## 📅 Update Jadwal

Update jadwal di file `src/server/index.ts`:

```typescript
const monthlySchedules = [
  {
    month: 'Januari',
    year: 2026,
    schedules: [
      { date: 3, day: 'Sabtu', frontOffice: 'Dirga', middleOffice: 'Alawi', backOffice: 'Rine' },
      // ... tambah schedule lainnya
    ]
  },
  // Tambah bulan lain di sini
  {
    month: 'Februari',
    year: 2026,
    schedules: [
      // ... schedule Februari
    ]
  }
]
```

## 🔍 Troubleshooting

### Error: "Email configuration verification failed"
- Check EMAIL_USER dan EMAIL_PASSWORD di `.env`
- Pastikan app password sudah benar (16 karakter, no spaces)
- Pastikan 2FA enabled di Gmail

### Email tidak terkirim
- Check log untuk error messages
- Verify email address di `developerEmails.ts` benar
- Test SMTP connection manual

### Scheduler tidak jalan
- Check timezone setting (harus `Asia/Jakarta`)
- Verify cron schedule syntax
- Check system time

## 📦 Deploy to Production

### Option 1: Run as background process (PM2)
```bash
bun install -g pm2
pm2 start "bun run scheduler" --name "standby-scheduler"
pm2 save
pm2 startup
```

### Option 2: Docker
```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production
COPY . .
CMD ["bun", "run", "scheduler"]
```

### Option 3: Systemd Service (Linux)
Create `/etc/systemd/system/standby-scheduler.service`:
```ini
[Unit]
Description=Stand By Email Scheduler
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/stand-by-schedule
ExecStart=/usr/bin/bun run scheduler
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable standby-scheduler
sudo systemctl start standby-scheduler
```

## 🎨 Customize Email Template

Edit `src/services/emailTemplates.ts` untuk customize tampilan email.

Template menggunakan inline CSS, jadi style akan work di semua email clients.

## ⏰ Mengubah Waktu Reminder

Edit `src/services/scheduler.ts`:

```typescript
// H-1 reminder - default 17:00
cron.schedule('0 17 * * *', async () => { ... })

// H reminder - default 06:00
cron.schedule('0 6 * * *', async () => { ... })
```

Cron format: `minute hour day month weekday`
- `0 17 * * *` = Every day at 17:00
- `0 6 * * *` = Every day at 06:00
- `0 9 * * 1-5` = Monday-Friday at 09:00

## 📞 Support

Kalo ada masalah, check:
1. Log output dari scheduler
2. `.env` configuration
3. Developer email mapping
4. Schedule data

---

**Note**: Jangan commit `.env` file ke git! File ini sudah di-add ke `.gitignore`.
