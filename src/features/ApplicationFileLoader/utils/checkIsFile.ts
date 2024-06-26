import { DocumentsFileMetadata } from 'shared/ui/FileDownloader/FileDownloader'

/** Проверяет, что переданный параметр это File */
export function checkIsFile(input: File | DocumentsFileMetadata | undefined): input is File {
  return input instanceof File
}
