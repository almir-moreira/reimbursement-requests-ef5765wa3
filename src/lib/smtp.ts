import { toast } from '@/hooks/use-toast'

interface SendEmailParams {
  to: string
  subject: string
  body: string
}

export const sendEmail = async ({ to, subject, body }: SendEmailParams) => {
  // Global Email Redirect (Testing)
  const actualTo = 'almir.moreira@kaiciid.org'
  const sender = 'support@kaiciid.org'

  console.log('--- SMTP EMAIL SENT ---')
  console.log(`From: ${sender}`)
  console.log(`Intended To: ${to}`)
  console.log(`Actual To (Redirected): ${actualTo}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)
  console.log('-----------------------')

  toast({
    title: 'Email Notification Sent',
    description: `To: ${actualTo} (Redirected from ${to}) | Subject: ${subject}`,
  })
}
