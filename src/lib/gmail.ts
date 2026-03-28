import { google } from 'googleapis'

function getGmailClient(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return google.gmail({ version: 'v1', auth })
}

function makeRawEmail(to: string, subject: string, html: string): string {
  const lines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html,
  ]
  return Buffer.from(lines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function sendEmail(
  accessToken: string,
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const gmail = getGmailClient(accessToken)
  const raw = makeRawEmail(to, subject, html)
  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } })
}
