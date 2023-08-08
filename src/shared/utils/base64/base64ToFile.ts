import { getExtension } from './getExtension'
import { getMimeType } from './getMimeType'

export function base64ToFile(base64: string, fileName = 'Файл') {
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const mime = getMimeType(base64)
  const blob = new Blob([bytes], { type: mime })

  return new File([blob], `${fileName}.${getExtension(mime)}`)
}
