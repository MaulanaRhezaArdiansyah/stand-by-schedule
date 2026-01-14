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
      background: linear-gradient(135deg, #0a0e27 0%, #1a1e3a 100%);
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header h1 {
      margin: 0;
      color: #e0e7ff;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
      color: #f1f5f9;
    }
    .alert-box {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
      border: 2px solid rgba(251, 191, 36, 0.4);
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
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #94a3b8;
      font-weight: 500;
    }
    .info-value {
      color: #e0e7ff;
      font-weight: 600;
    }
    .role-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }
    .footer {
      padding: 20px 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
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
        <h2 style="text-align: center; color: #fbbf24; margin: 10px 0;">Reminder: Stand By Besok!</h2>
        <p style="text-align: center; color: #fef3c7; margin: 10px 0;">
          Halo! Ini reminder untuk stand by schedule kamu besok.
        </p>
      </div>

      <div class="schedule-info">
        <h3 style="color: #e0e7ff; margin-top: 0;">Detail Jadwal:</h3>
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

      <div style="background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #c4b5fd; font-weight: 500;">
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
      background: linear-gradient(135deg, #0a0e27 0%, #1a1e3a 100%);
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header h1 {
      margin: 0;
      color: #fecaca;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
      color: #f1f5f9;
    }
    .alert-box {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
      border: 2px solid rgba(239, 68, 68, 0.4);
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
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #94a3b8;
      font-weight: 500;
    }
    .info-value {
      color: #e0e7ff;
      font-weight: 600;
    }
    .footer {
      padding: 20px 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .checklist {
      background: rgba(16, 185, 129, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .checklist-item {
      padding: 10px 0;
      color: #d1fae5;
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
        <h2 style="text-align: center; color: #fca5a5; margin: 10px 0;">Stand By Dimulai Hari Ini!</h2>
        <p style="text-align: center; color: #fecaca; margin: 10px 0;">
          Stand by kamu dimulai hari ini jam 06.00 WIB. Pastikan kamu siap!
        </p>
      </div>

      <div class="schedule-info">
        <h3 style="color: #e0e7ff; margin-top: 0;">Detail Jadwal:</h3>
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
        <h3 style="color: #6ee7b7; margin-top: 0;">✅ Checklist:</h3>
        <div class="checklist-item">✓ Pastikan laptop/device siap</div>
        <div class="checklist-item">✓ Koneksi internet stabil</div>
        <div class="checklist-item">✓ Sudah breakfast/siap bekerja</div>
        <div class="checklist-item">✓ Siap standby dari jam 06.00 WIB</div>
      </div>

      <div style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #fef3c7; font-weight: 500;">
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
