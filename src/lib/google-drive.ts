import { google } from 'googleapis'

const APP_FOLDER_NAME = 'TWATS Data'

function getDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return google.drive({ version: 'v3', auth })
}

export async function getOrCreateAppFolder(accessToken: string): Promise<string> {
  const drive = getDriveClient(accessToken)

  const res = await drive.files.list({
    q: `name='${APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
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

export async function readCollection<T>(accessToken: string, collection: string): Promise<T[]> {
  const drive = getDriveClient(accessToken)
  const folderId = await getOrCreateAppFolder(accessToken)

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

  try {
    return JSON.parse(file.data as string) as T[]
  } catch {
    return []
  }
}

export async function writeCollection<T>(
  accessToken: string,
  collection: string,
  data: T[]
): Promise<void> {
  const drive = getDriveClient(accessToken)
  const folderId = await getOrCreateAppFolder(accessToken)

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
