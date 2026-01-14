import dotenv from 'dotenv'
import { startSchedulers, setSchedulesData } from '../services/scheduler.js'
import { verifyEmailConfig } from '../services/emailService.js'
import { createServer } from 'http'

// Load environment variables
dotenv.config()

// Import schedules data (same structure as in App.tsx)
const monthlySchedules = [
  {
    month: 'Januari',
    year: 2026,
    schedules: [
      { date: 3, day: 'Sabtu', frontOffice: 'Dirga', middleOffice: 'Alawi', backOffice: 'Rine' },
      { date: 4, day: 'Minggu', frontOffice: 'Hilmi', middleOffice: 'Farhan', backOffice: 'Ira' },
      { date: 10, day: 'Sabtu', frontOffice: 'Ardan', middleOffice: 'Farhan', backOffice: 'Miftah' },
      { date: 11, day: 'Minggu', frontOffice: 'Dirga', middleOffice: 'Rheza', backOffice: 'Maulana' },
      { date: 17, day: 'Sabtu', frontOffice: 'Hilmi', middleOffice: 'Vigo', backOffice: 'Maulana', notes: 'jgn lupa input SOC ya maksimal 2 hari' },
      { date: 18, day: 'Minggu', frontOffice: 'Ardan', middleOffice: 'Vigo', backOffice: 'Miftah', notes: 'typenya overtime SOC dari jam 06.00-22.30' },
      { date: 24, day: 'Sabtu', frontOffice: 'Hilmi', middleOffice: 'Rheza', backOffice: 'Ira' },
      { date: 25, day: 'Minggu', frontOffice: 'Dirga', middleOffice: 'Alawi', backOffice: 'Maulana' },
      { date: 31, day: 'Minggu', frontOffice: 'Ardan', middleOffice: 'Farhan', backOffice: 'Rine' },
    ],
    monthNotes: [
      'jgn lupa input SOC ya maksimal 2 hari',
      'typenya overtime SOC dari jam 06.00-22.30'
    ]
  }
]

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

  // Set schedules data
  console.log('\n📅 Loading schedules data...')
  setSchedulesData(monthlySchedules)
  console.log(`✅ Loaded ${monthlySchedules.length} month(s) of schedules`)

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
