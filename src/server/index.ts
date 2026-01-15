import dotenv from 'dotenv'
import { startSchedulers, setSchedulesData } from '../services/scheduler.js'
import { verifyEmailConfig } from '../services/emailService.js'
import { createServer } from 'http'
import { fetchGistData } from './gistService.js'

// Load environment variables
dotenv.config()

// Create a simple HTTP server for health checks
const PORT = process.env.PORT || 10000

const server = createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      service: 'standby-scheduler',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

async function main() {
  console.log('🚀 Starting Stand By Email Scheduler...')
  console.log('='.repeat(50))

  // Start HTTP server for health checks
  server.listen(PORT, () => {
    console.log(`\n🏥 Health check server running on port ${PORT}`)
  })

  // Verify email configuration
  console.log('\n📧 Verifying email configuration...')
  const isEmailValid = await verifyEmailConfig()

  if (!isEmailValid) {
    console.error('❌ Email configuration is invalid. Please check your .env file.')
    console.error('   Make sure EMAIL_USER and EMAIL_PASSWORD are set correctly.')
    process.exit(1)
  }

  console.log('✅ Email configuration verified')

  // Load schedules data from Gist
  console.log('\n📅 Loading schedules data from GitHub Gist...')
  const gistData = await fetchGistData()

  // Group schedules by month
  const monthlySchedules = gistData.schedules.reduce((acc, schedule) => {
    const key = `${schedule.month}-${schedule.year}`
    if (!acc[key]) {
      acc[key] = {
        month: schedule.month,
        year: schedule.year,
        schedules: [],
        monthNotes: gistData.monthNotes
      }
    }
    acc[key].schedules.push({
      date: schedule.date,
      day: schedule.day,
      frontOffice: schedule.frontOffice,
      middleOffice: schedule.middleOffice,
      backOffice: schedule.backOffice,
      notes: schedule.notes
    })
    return acc
  }, {} as Record<string, any>)

  const monthSchedulesArray = Object.values(monthlySchedules)

  setSchedulesData(monthSchedulesArray)
  console.log(`✅ Loaded ${monthSchedulesArray.length} month(s) with ${gistData.schedules.length} schedule(s)`)
  console.log(`✅ Loaded ${gistData.developers.length} developer(s) data`)

  // Start schedulers
  console.log('\n⏰ Starting schedulers...')
  startSchedulers()

  console.log('\n' + '='.repeat(50))
  console.log('✅ Email scheduler is running!')
  console.log('📝 Schedule:')
  console.log('   - H-1 Reminder: Daily at 17:00 WIB (5 PM)')
  console.log('   - H Reminder:   Daily at 06:00 WIB (6 AM)')
  console.log('\n💡 Press Ctrl+C to stop the scheduler')
  console.log('='.repeat(50) + '\n')
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Stopping schedulers...')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Stopping schedulers...')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

// Start the application
main().catch((error) => {
  console.error('❌ Failed to start scheduler:', error)
  process.exit(1)
})
