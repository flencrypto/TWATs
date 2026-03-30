import { getToken } from 'next-auth/jwt'
import { sendEmail } from '@/lib/gmail'
import { getAuthSecret } from '@/lib/auth-secret'
import { NextRequest, NextResponse } from 'next/server'

const MAX_EMAIL_LENGTH = 320
const MAX_SUBJECT_LENGTH = 255
const MAX_HTML_LENGTH = 20_000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HEADER_INJECTION = /[\r\n]/

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: getAuthSecret() })
  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    to: unknown
    subject: unknown
    html: unknown
  }
  try {
    body = await req.json() as {
      to: unknown
      subject: unknown
      html: unknown
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    throw err
  }

  const { to, subject, html } = body

  if (typeof to !== 'string' || typeof subject !== 'string' || typeof html !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const trimmedTo = to.trim()
  const trimmedSubject = subject.trim()

  if (!trimmedTo || !trimmedSubject || !html) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (HEADER_INJECTION.test(trimmedTo) || HEADER_INJECTION.test(trimmedSubject)) {
    return NextResponse.json({ error: 'Invalid characters in to or subject' }, { status: 400 })
  }

  if (
    trimmedTo.length > MAX_EMAIL_LENGTH ||
    trimmedSubject.length > MAX_SUBJECT_LENGTH ||
    html.length > MAX_HTML_LENGTH
  ) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 400 })
  }

  if (!EMAIL_REGEX.test(trimmedTo)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    await sendEmail(
      token.accessToken as string,
      trimmedTo,
      trimmedSubject,
      html,
      token.refreshToken as string | undefined,
      token.expiresAt as number | undefined
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Gmail send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
