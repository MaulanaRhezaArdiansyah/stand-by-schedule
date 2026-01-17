import dotenv from 'dotenv'
import { startSchedulers, setSchedulesData } from '../services/scheduler.js'
import { verifyEmailConfig } from '../services/emailService.js'
import { createServer } from 'http'
import { fetchSupabaseData } from './supabaseService.js'
import { handleRequest } from './router.js'

interface MonthlySchedule {
  month: string
  year: number
  schedules: Array<{
    date: number
    day: string
    frontOffice: string
    middleOffice: string
    backOffice: string
    notes?: string
  }>
  monthNotes: string[]
}

// Load environment variables
dotenv.config()

// Create a simple HTTP server with API support
const PORT = process.env.PORT || 10000

const server = createServer(async (req, res) => {
  const handled = await handleRequest(req, res)

  if (!handled) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

async function main() {
  console.log('🚀 Starting Stand By Email Scheduler...')
  console.log('='.repeat(50))

  // Start HTTP server with API
  server.listen(PORT, () => {
    console.log(`\n🌐 API server running on port ${PORT}`)
    console.log(`   - Health: http://localhost:${PORT}/health`)
    console.log(`   - Login:  http://localhost:${PORT}/api/auth/login`)
    console.log(`   - Data:   http://localhost:${PORT}/api/data`)
  })

  // Verify email configuration (optional - don't block server startup)
  console.log('\n📧 Verifying email configuration...')
  try {
    const isEmailValid = await verifyEmailConfig()
    if (isEmailValid) {
      console.log('✅ Email configuration verified')
    } else {
      console.warn('⚠️  Email configuration might be invalid.')
      console.warn('   Scheduler will continue but email sending may fail.')
    }
  } catch (error) {
    console.warn('⚠️  Email verification failed:', error instanceof Error ? error.message : String(error))
    console.warn('   Scheduler will continue but email sending may fail.')
  }

  // Load schedules data from Supabase
  console.log('\n📅 Loading schedules data from Supabase...')
  const gistData = await fetchSupabaseData()

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
  }, {} as Record<string, MonthlySchedule>)

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
