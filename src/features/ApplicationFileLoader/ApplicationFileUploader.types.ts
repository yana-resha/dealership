import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

export enum DocumentUploadStatus {
  /** документ был выбран, загрузка еще не началась */
  Local = 'local',
  /** документ загружается */
  Progress = 'progress',
  /** документ загружен */
  Upload = 'upload',
  /** ошибка загрузки файла */
  Error = 'error',
}

/** Мета данные о файле по которым можно его запросить */
type FileMetadata = {
  dcAppId: string
  documentType: DocumentType
  name?: string
}

export type FileInfo = {
  file: File | FileMetadata
  status: DocumentUploadStatus
}

/** Вид конфига для выгружаемых документов */
export type UploaderConfig = {
  documentLabel: string
  documentName: string
  documentType: DocumentType
  documentFile: FileInfo | null
  documentError?: string
}
