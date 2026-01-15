interface ScheduleInfo {
  date: number
  month: string
  year: number
  day: string
  role: string
}

// Email template untuk H-1 (reminder besok)
export function getH1ReminderTemplate(info: ScheduleInfo): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #f3f4f6;
    }
    .header h1 {
      margin: 0;
      color: #78350f;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
      color: #1f2937;
    }
    .alert-box {
      background: #fef3c7;
      border: 2px solid #fbbf24;
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .alert-icon {
      font-size: 48px;
      text-align: center;
      margin-bottom: 10px;
    }
    .schedule-info {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    .info-value {
      color: #111827;
      font-weight: 600;
    }
    .footer {
      padding: 20px 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Stand By Reminder</h1>
    </div>

    <div class="content">
      <div class="alert-box">
        <div class="alert-icon">⚠️</div>
        <h2 style="text-align: center; color: #92400e; margin: 10px 0;">Reminder: Stand By Besok!</h2>
        <p style="text-align: center; color: #78350f; margin: 10px 0;">
          Halo! Ini reminder untuk stand by schedule kamu besok.
        </p>
      </div>

      <div class="schedule-info">
        <h3 style="color: #111827; margin-top: 0;">Detail Jadwal:</h3>
        <div class="info-row">
          <span class="info-label">Tanggal:&nbsp;</span>
          <span class="info-value">${info.day}, ${info.date} ${info.month} ${info.year}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Role:&nbsp;</span>
          <span class="info-value">${info.role}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Waktu:&nbsp;</span>
          <span class="info-value">06.00 - 22.30 WIB</span>
        </div>
      </div>

      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #1e40af; font-weight: 500;">
          💡 Jangan lupa input jam lembur di <strong>Revo HRIS</strong> dengan tipe <strong>overtime SOC</strong> maksimal 2 hari setelah stand by!
        </p>
      </div>
    </div>

    <div class="footer">
      <p>Stand By Schedule System • Jadwal Bulanan Tim Dev</p>
      <p style="margin-top: 10px; font-size: 12px; color: #64748b;">
        Email otomatis dari sistem. Jangan balas email ini.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Email template untuk hari H (jam 6 pagi)
export function getHReminderTemplate(info: ScheduleInfo): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #f3f4f6;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
      color: #1f2937;
    }
    .alert-box {
      background: #fee2e2;
      border: 2px solid #ef4444;
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .alert-icon {
      font-size: 48px;
      text-align: center;
      margin-bottom: 10px;
    }
    .schedule-info {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    .info-value {
      color: #111827;
      font-weight: 600;
    }
    .footer {
      padding: 20px 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .checklist {
      background: #d1fae5;
      border: 1px solid #10b981;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .checklist-item {
      padding: 10px 0;
      color: #065f46;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Stand By Hari Ini!</h1>
    </div>

    <div class="content">
      <div class="alert-box">
        <div class="alert-icon">🚨</div>
        <h2 style="text-align: center; color: #991b1b; margin: 10px 0;">Stand By Dimulai Hari Ini!</h2>
        <p style="text-align: center; color: #7f1d1d; margin: 10px 0;">
          Stand by kamu dimulai hari ini jam 06.00 WIB. Pastikan kamu siap!
        </p>
      </div>

      <div class="schedule-info">
        <h3 style="color: #111827; margin-top: 0;">Detail Jadwal:</h3>
        <div class="info-row">
          <span class="info-label">Tanggal:&nbsp;</span>
          <span class="info-value">${info.day}, ${info.date} ${info.month} ${info.year}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Role:&nbsp;</span>
          <span class="info-value">${info.role}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Waktu:&nbsp;</span>
          <span class="info-value">06.00 - 22.30 WIB</span>
        </div>
      </div>

      <div class="checklist">
        <h3 style="color: #065f46; margin-top: 0;">✅ Checklist:</h3>
        <div class="checklist-item">✓ Pastikan laptop/device siap</div>
        <div class="checklist-item">✓ Koneksi internet stabil</div>
        <div class="checklist-item">✓ Sudah breakfast/siap bekerja</div>
        <div class="checklist-item">✓ Siap standby dari jam 06.00 WIB</div>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #78350f; font-weight: 500;">
          💡 Jangan lupa input jam lembur di <strong>Revo HRIS</strong> dengan tipe <strong>overtime SOC</strong> maksimal 2 hari setelah stand by!
        </p>
      </div>
    </div>

    <div class="footer">
      <p>Stand By Schedule System • Jadwal Bulanan Tim Dev</p>
      <p style="margin-top: 10px; font-size: 12px; color: #64748b;">
        Email otomatis dari sistem. Jangan balas email ini.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Email template untuk hourly reminder (team leads)
export function getHourlyReminderTemplate(): string {
  const now = new Date()
  const hour = now.getHours()
  const timeStr = hour.toString().padStart(2, '0') + '.00 WIB'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #f3f4f6;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
      color: #1f2937;
    }
    .reminder-box {
      background: #dbeafe;
      border: 2px solid #3b82f6;
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .reminder-icon {
      font-size: 48px;
      text-align: center;
      margin-bottom: 10px;
    }
    .checklist-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .checklist-box h3 {
      color: #111827;
      margin-top: 0;
      margin-bottom: 15px;
    }
    .checklist-item {
      padding: 10px 0;
      padding-left: 25px;
      position: relative;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    .checklist-item:last-child {
      border-bottom: none;
    }
    .checklist-item:before {
      content: "📌";
      position: absolute;
      left: 0;
    }
    .footer {
      padding: 20px 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Hourly Team Check</h1>
    </div>

    <div class="content">
      <div class="reminder-box">
        <div class="reminder-icon">👨‍💼</div>
        <h2 style="text-align: center; color: #1e40af; margin: 10px 0;">Reminder untuk Team Lead</h2>
        <p style="text-align: center; color: #1e3a8a; margin: 10px 0;">
          Waktu check-in progress team - ${timeStr}
        </p>
      </div>

      <div class="checklist-box">
        <h3>✅ Yang Perlu Dicek:</h3>
        <div class="checklist-item">
          <strong>Hotfix Tasks:</strong> Check task hotfix yang urgent dan perlu immediate action
        </div>
        <div class="checklist-item">
          <strong>Need Condition:</strong> Review task yang butuh kondisi/approval tertentu
        </div>
        <div class="checklist-item">
          <strong>Todo Tasks:</strong> Tanya progress task yang masih di backlog/todo
        </div>
        <div class="checklist-item">
          <strong>In Progress:</strong> Follow up task yang sedang dikerjakan team
        </div>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #78350f; font-weight: 500;">
          💡 <strong>Action:</strong> Komunikasikan dengan team member untuk update progress dan unblock blocker jika ada.
        </p>
      </div>

      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #065f46; font-weight: 500;">
          📊 <strong>Tips:</strong> Pastikan semua task di board up-to-date dan team tidak stuck tanpa bantuan.
        </p>
      </div>
    </div>

    <div class="footer">
      <p>Hourly Team Check System • Senin - Jumat, 08.00 - 17.00 WIB</p>
      <p style="margin-top: 10px; font-size: 12px; color: #64748b;">
        Email otomatis dari sistem. Jangan balas email ini.
      </p>
    </div>
  </div>
</body>
</html>
  `
}
