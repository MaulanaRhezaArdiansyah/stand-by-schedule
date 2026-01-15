import cron from 'node-cron'
import { sendEmail } from './emailService.js'
import { getEmailByName } from '../config/developerEmails.js'
import { getH1ReminderTemplate, getHReminderTemplate, getHourlyReminderTemplate } from './emailTemplates.js'

interface DaySchedule {
  date: number
  day: string
  frontOffice: string
  middleOffice: string
  backOffice: string
  notes?: string
}

interface MonthSchedule {
  month: string
  year: number
  schedules: DaySchedule[]
}

// Get schedules from data (you can import from App.tsx or separate data file)
let monthlySchedules: MonthSchedule[] = []

// Function to set schedules data
export function setSchedulesData(schedules: MonthSchedule[]) {
  monthlySchedules = schedules
  console.log('Schedules data updated')
}

// Get schedule for specific date
function getScheduleForDate(date: Date): { schedule: DaySchedule; monthInfo: { month: string; year: number } } | null {
  const targetDate = date.getDate()
  const targetMonth = date.toLocaleDateString('id-ID', { month: 'long' })
  const targetYear = date.getFullYear()

  for (const monthSchedule of monthlySchedules) {
    if (monthSchedule.month === targetMonth && monthSchedule.year === targetYear) {
      const schedule = monthSchedule.schedules.find(s => s.date === targetDate)
      if (schedule) {
        return {
          schedule,
          monthInfo: { month: monthSchedule.month, year: monthSchedule.year }
        }
      }
    }
  }
  return null
}

// Send reminder email to a developer
async function sendReminderEmail(
  developerName: string,
  role: string,
  scheduleDate: Date,
  isH1: boolean,
  monthInfo: { month: string; year: number }
) {
  const email = getEmailByName(developerName)
  if (!email) {
    console.warn(`Email not found for ${developerName}`)
    return
  }

  const scheduleInfo = {
    date: scheduleDate.getDate(),
    month: monthInfo.month,
    year: monthInfo.year,
    day: scheduleDate.toLocaleDateString('id-ID', { weekday: 'long' }),
    role,
  }

  const subject = isH1
    ? process.env.EMAIL_SUBJECT_H1 || 'Reminder: Stand By Besok'
    : process.env.EMAIL_SUBJECT_H || 'Stand By Hari Ini - Jam 06.00'

  const html = isH1
    ? getH1ReminderTemplate(scheduleInfo)
    : getHReminderTemplate(scheduleInfo)

  await sendEmail({ to: email, subject, html })
}

// Send reminders for a specific schedule
async function sendRemindersForSchedule(schedule: DaySchedule, scheduleDate: Date, isH1: boolean, monthInfo: { month: string; year: number }) {
  const reminders = [
    { name: schedule.frontOffice, role: 'Front Office' },
    { name: schedule.middleOffice, role: 'Middle Office' },
    { name: schedule.backOffice, role: 'Back Office' },
  ]

  for (const { name, role } of reminders) {
    await sendReminderEmail(name, role, scheduleDate, isH1, monthInfo)
  }
}

// H-1 Reminder: Send at 17:00 the day before
export function scheduleH1Reminders() {
  // Run every day at 17:00 (5 PM)
  cron.schedule('0 17 * * *', async () => {
    console.log('Running H-1 reminder check at 17:00...')

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const scheduleInfo = getScheduleForDate(tomorrow)
    if (scheduleInfo) {
      console.log(`Found schedule for tomorrow (${tomorrow.toLocaleDateString('id-ID')})`)
      await sendRemindersForSchedule(scheduleInfo.schedule, tomorrow, true, scheduleInfo.monthInfo)
    } else {
      console.log(`No schedule found for tomorrow (${tomorrow.toLocaleDateString('id-ID')})`)
    }
  }, {
    timezone: 'Asia/Jakarta'
  })

  console.log('H-1 reminder scheduler started (runs daily at 17:00 WIB)')
}

// H Reminder: Send at 06:00 on the day
export function scheduleHReminders() {
  // Run every day at 06:00 (6 AM)
  cron.schedule('0 6 * * *', async () => {
    console.log('Running H reminder check at 06:00...')

    const today = new Date()

    const scheduleInfo = getScheduleForDate(today)
    if (scheduleInfo) {
      console.log(`Found schedule for today (${today.toLocaleDateString('id-ID')})`)
      await sendRemindersForSchedule(scheduleInfo.schedule, today, false, scheduleInfo.monthInfo)
    } else {
      console.log(`No schedule found for today (${today.toLocaleDateString('id-ID')})`)
    }
  }, {
    timezone: 'Asia/Jakarta'
  })

  console.log('H reminder scheduler started (runs daily at 06:00 WIB)')
}

// Hourly Reminder: Send to team leads every hour (Mon-Fri, 8 AM - 5 PM)
export function scheduleHourlyReminders() {
  // Run every hour from 8 AM to 5 PM, Monday to Friday
  // Cron: minute hour day month weekday
  // 0 8-17 * * 1-5 means: at minute 0, from 8 AM to 5 PM, Mon-Fri
  cron.schedule('0 8-17 * * 1-5', async () => {
    const now = new Date()
    const hour = now.getHours()
    console.log(`Running hourly team reminder check at ${hour}:00...`)

    // Team leads: Alawi (MO), Miftah (BO), Dirga (FO)
    const teamLeads = [
      { name: 'Alawi', division: 'Middle Office' },
      { name: 'Miftah', division: 'Back Office' },
      { name: 'Dirga', division: 'Front Office' }
    ]

    const subject = `⏰ Hourly Team Check - ${hour.toString().padStart(2, '0')}.00 WIB`
    const html = getHourlyReminderTemplate()

    for (const lead of teamLeads) {
      const email = getEmailByName(lead.name)
      if (email) {
        await sendEmail({ to: email, subject, html })
        console.log(`Hourly reminder sent to ${lead.name} (${lead.division})`)
      } else {
        console.warn(`Email not found for team lead: ${lead.name}`)
      }
    }
  }, {
    timezone: 'Asia/Jakarta'
  })

  console.log('Hourly team reminder scheduler started (Mon-Fri, 08:00-17:00 WIB)')
}

// Start all schedulers
export function startSchedulers() {
  scheduleH1Reminders()
  scheduleHReminders()
  scheduleHourlyReminders()
  console.log('All schedulers started successfully')
}

// Stop all schedulers
export function stopSchedulers() {
  cron.getTasks().forEach(task => task.stop())
  console.log('All schedulers stopped')
}
