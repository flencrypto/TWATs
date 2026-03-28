import { auth } from '@/auth'
import { readCollection, writeCollection } from '@/lib/google-drive'
import { NextRequest, NextResponse } from 'next/server'

const VALID_COLLECTIONS = ['clients', 'jobs', 'quotes', 'invoices', 'certificates']

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await readCollection(session.accessToken, collection)
    return NextResponse.json(data)
  } catch (err) {
    console.error(`Drive read error [${collection}]:`, err)
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    await writeCollection(session.accessToken, collection, data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`Drive write error [${collection}]:`, err)
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 })
  }
}
