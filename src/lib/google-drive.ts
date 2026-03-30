import { google } from 'googleapis'

const APP_FOLDER_NAME = 'TWATS Data'
const VALID_COLLECTIONS = new Set(['clients', 'jobs', 'quotes', 'invoices', 'certificates'])

type DriveClient = ReturnType<typeof google.drive>

function assertValidCollection(collection: string): void {
  if (!VALID_COLLECTIONS.has(collection)) {
    throw new Error(`Invalid collection: ${collection}`)
  }
}

function getDriveClient(
  accessToken: string,
  refreshToken?: string,
  expiryDate?: number
): DriveClient {
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
  return google.drive({ version: 'v3', auth })
}

async function getOrCreateAppFolder(drive: DriveClient): Promise<string> {
  const res = await drive.files.list({
    q: `name='${APP_FOLDER_NAME.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
    spaces: 'drive',
  })

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!
  }

  const folder = await drive.files.create({
    requestBody: {
      name: APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  })

  return folder.data.id!
}

export async function readCollection<T>(
  accessToken: string,
  collection: string,
  refreshToken?: string,
  expiresAt?: number
): Promise<T[]> {
  assertValidCollection(collection)
  const expiryDate = typeof expiresAt === 'number' ? expiresAt * 1000 : undefined
  const drive = getDriveClient(accessToken, refreshToken, expiryDate)
  const folderId = await getOrCreateAppFolder(drive)

  const res = await drive.files.list({
    q: `name='${collection}.json' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id)',
    spaces: 'drive',
  })

  if (!res.data.files || res.data.files.length === 0) {
    return []
  }

  const fileId = res.data.files[0].id!
  const file = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'text' })

  const raw = file.data as string
  try {
    return JSON.parse(raw) as T[]
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`Failed to parse collection '${collection}.json' from Google Drive: ${msg}`)
  }
}

export async function writeCollection<T>(
  accessToken: string,
  collection: string,
  data: T[],
  refreshToken?: string,
  expiresAt?: number
): Promise<void> {
  assertValidCollection(collection)
  const expiryDate = typeof expiresAt === 'number' ? expiresAt * 1000 : undefined
  const drive = getDriveClient(accessToken, refreshToken, expiryDate)
  const folderId = await getOrCreateAppFolder(drive)

  const res = await drive.files.list({
    q: `name='${collection}.json' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id)',
    spaces: 'drive',
  })

  const body = JSON.stringify(data)
  const media = { mimeType: 'application/json', body }

  if (res.data.files && res.data.files.length > 0) {
    const fileId = res.data.files[0].id!
    await drive.files.update({ fileId, media })
  } else {
    await drive.files.create({
      requestBody: { name: `${collection}.json`, parents: [folderId] },
      media,
    })
  }
}
