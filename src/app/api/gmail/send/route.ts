import { auth } from '@/auth'
import { sendEmail } from '@/lib/gmail'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { to, subject, html } = await req.json() as {
    to: string
    subject: string
    html: string
  }

  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await sendEmail(session.accessToken, to, subject, html)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Gmail send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
