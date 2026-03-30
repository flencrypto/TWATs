import { google } from 'googleapis'

type GmailClient = ReturnType<typeof google.gmail>

function getGmailClient(
  accessToken: string,
  refreshToken?: string,
  expiryDate?: number
): GmailClient {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  const credentials: { access_token: string; refresh_token?: string; expiry_date?: number } = {
    access_token: accessToken,
  }
  if (refreshToken) credentials.refresh_token = refreshToken
  if (typeof expiryDate === 'number') credentials.expiry_date = expiryDate
  auth.setCredentials(credentials)
  return google.gmail({ version: 'v1', auth })
}

/** Strips any CR or LF from a header value to prevent injection. */
function sanitiseHeader(value: string): string {
  return value.replace(/[\r\n]/g, '')
}

function makeRawEmail(to: string, subject: string, html: string): string {
  const safeTo = sanitiseHeader(to)
  const safeSubject = sanitiseHeader(subject)
  const lines = [
    `To: ${safeTo}`,
    `Subject: ${safeSubject}`,
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
  html: string,
  refreshToken?: string,
  expiresAt?: number
): Promise<void> {
  const expiryDate = typeof expiresAt === 'number' ? expiresAt * 1000 : undefined
  const gmail = getGmailClient(accessToken, refreshToken, expiryDate)
  const raw = makeRawEmail(to, subject, html)
  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } })
}
