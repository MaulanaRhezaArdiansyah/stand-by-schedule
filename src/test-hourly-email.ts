import dotenv from 'dotenv'
import { sendEmail } from './services/emailService.js'
import { getEmailByName } from './config/developerEmails.js'
import { getHourlyReminderTemplate } from './services/emailTemplates.js'

// Load environment variables
dotenv.config()

async function testHourlyEmail() {
  console.log('🧪 Testing hourly reminder email...\n')

  // Team leads
  const teamLeads = [
    { name: 'Alawi', division: 'Middle Office' },
    { name: 'Miftah', division: 'Back Office' },
    { name: 'Dirga', division: 'Front Office' }
  ]

  const now = new Date()
  const hour = now.getHours()
  const subject = `⏰ Hourly Team Check - ${hour.toString().padStart(2, '0')}.00 WIB`
  const html = getHourlyReminderTemplate()

  console.log(`Subject: ${subject}\n`)

  for (const lead of teamLeads) {
    const email = getEmailByName(lead.name)
    if (email) {
      console.log(`Sending to ${lead.name} (${lead.division}): ${email}`)
      await sendEmail({ to: email, subject, html })
      console.log(`✅ Sent successfully\n`)
    } else {
      console.warn(`⚠️  Email not found for ${lead.name}\n`)
    }
  }

  console.log('✅ All hourly reminder test emails sent!')
}

testHourlyEmail().catch(console.error)
