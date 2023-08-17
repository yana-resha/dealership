import { FileMetadata } from 'shared/ui/FileDownloader/FileDownloader'

/** Проверяет, что переданный параметр это File */
export function checkIsFile(input: File | FileMetadata | undefined): input is File {
  return input instanceof File
}
