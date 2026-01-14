import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface EmailParams {
  to: string
  subject: string
  html: string
}

// Send email function
export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Stand By Scheduler <noreply@standby.com>',
      to,
      subject,
      html,
    })

    console.log(`Email sent to ${to}: ${info.messageId}`)
    return true
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error)
    return false
  }
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('Email configuration verification failed:', error)
    return false
  }
}
