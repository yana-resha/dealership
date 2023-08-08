const signatures: Record<string, string> = {
  JVBERi0: 'application/pdf',
  R0lGODdh: 'image/gif',
  R0lGODlh: 'image/gif',
  iVBORw0KGgo: 'image/png',
  '/9j/': 'image/jpg',
}

export function getMimeType(strBase64: string) {
  for (const sign in signatures) {
    if (strBase64.startsWith(sign)) {
      return signatures[sign]
    }
  }

  return 'application/octet-stream'
}
