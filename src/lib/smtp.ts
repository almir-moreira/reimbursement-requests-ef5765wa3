import { toast } from '@/hooks/use-toast'

interface SendEmailParams {
  to: string
  subject: string
  body: string
}

export const sendEmail = async ({ to, subject, body }: SendEmailParams) => {
  // Mocking SMTP implementation via Brevo
  const smtpConfig = {
    host: 'smtp-relay.brevo.com',
    port: 587,
    user: 'support@kaiciid.org',
    auth: true,
  }

  console.log('--- SMTP EMAIL SENT ---')
  console.log(`Host: ${smtpConfig.host}:${smtpConfig.port}`)
  console.log(`From: ${smtpConfig.user}`)
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)
  console.log('-----------------------')

  toast({
    title: 'Email Notification Sent',
    description: `To: ${to} | Subject: ${subject}`,
  })
}
