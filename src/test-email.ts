import dotenv from 'dotenv'
import { sendEmail } from './services/emailService.js'
import { getH1ReminderTemplate, getHReminderTemplate } from './services/emailTemplates.js'

dotenv.config()

async function testEmail() {
  console.log('\n🧪 Testing Email Send...')
  console.log('=' .repeat(50))

  // Test data
  const testScheduleInfo = {
    date: 17,
    month: 'Januari',
    year: 2026,
    day: 'Sabtu',
    role: 'Middle Office'
  }

  console.log('\n📧 Sending test email...')
  console.log(`From: ${process.env.EMAIL_FROM}`)
  console.log(`To: maulanarhezaardiansyah2000@gmail.com`)
  console.log(`Subject: ${process.env.EMAIL_SUBJECT_H1}`)

  // Test H-1 Reminder
  console.log('\n📨 Sending H-1 Reminder (Preview email besok)...')
  const h1Success = await sendEmail({
    to: 'maulanarhezaardiansyah2000@gmail.com',
    subject: process.env.EMAIL_SUBJECT_H1 || 'Reminder: Stand By Besok',
    html: getH1ReminderTemplate(testScheduleInfo)
  })

  if (h1Success) {
    console.log('✅ H-1 Reminder email sent successfully!')
  } else {
    console.log('❌ Failed to send H-1 Reminder email')
  }

  // Tunggu 2 detik
  console.log('\n⏳ Waiting 2 seconds...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test H Reminder
  console.log('\n📨 Sending H Reminder (Hari ini stand by)...')
  const hSuccess = await sendEmail({
    to: 'maulanarhezaardiansyah2000@gmail.com',
    subject: process.env.EMAIL_SUBJECT_H || 'Stand By Hari Ini - Jam 06.00',
    html: getHReminderTemplate(testScheduleInfo)
  })

  if (hSuccess) {
    console.log('✅ H Reminder email sent successfully!')
  } else {
    console.log('❌ Failed to send H Reminder email')
  }

  console.log('\n' + '='.repeat(50))
  console.log('🎉 Email test completed!')
  console.log('\n💡 Check inbox: maulanarhezaardiansyah2000@gmail.com')
  console.log('   You should receive 2 emails:')
  console.log('   1. H-1 Reminder (yellow theme)')
  console.log('   2. H Reminder (red theme)')
  console.log('')
}

testEmail().catch(console.error)
