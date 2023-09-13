import { useCallback, useEffect, useRef } from 'react'

import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { useApplicationContext } from 'entities/application/ApplicationProvider'
import { useCheckDocumentsList } from 'features/ApplicationFileLoader/hooks/useCheckDocumentsList'
import {
  useGetApplicationDocumentsListMutation,
  useUploadDocumentMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'

import { FileInfo, UploaderConfig, DocumentUploadStatus } from '../ApplicationFileUploader.types'
import { checkIsFile } from '../utils/checkIsFile'

type UseUploadDocumentParams = {
  uploaderConfig: UploaderConfig

  /** Если хотим чтобы форма не только выводила файл, но и могла изменять и выгружать его на бэк.
   * Меняет внешний вид компонента */
  onUploadDocument?: (file: File, documentName: string, status: FileInfo['status']) => void
  onError?: (documentName: string) => void
}

/** Отправляет файл на сервер и ждет подтверждение о загрузке */
const useUploadDocument = (params: UseUploadDocumentParams) => {
  const { uploaderConfig, onError, onUploadDocument } = params
  const { documentName, documentFile, documentType } = uploaderConfig || {}

  const { onGetOrderId } = useApplicationContext()
  const { mutateAsync: uploadDocument } = useUploadDocumentMutation()

  const { checkApplicationDocumentsList } = useCheckDocumentsList()

  const sendFile = useCallback(async () => {
    const file = documentFile?.file
    // Если файл не задан, или есть метаинформация о файле, а не сам файл
    if (!file || !checkIsFile(file)) {
      return
    }

    onUploadDocument?.(file, documentName, DocumentUploadStatus.Progress)
    try {
      const dcAppId = await onGetOrderId?.()
      if (!dcAppId) {
        throw new Error('dcAppId is empty')
      }

      await uploadDocument({
        dcAppId,
        file,
        documentType,
      })
      onUploadDocument?.(file, documentName, DocumentUploadStatus.Sended)

      // Опрашиваем бэк о статусе загрузки файлов
      const uploadedDocuments = await checkApplicationDocumentsList(dcAppId, [documentType])
      if (!uploadedDocuments.length) {
        throw new Error('Failed to upload the document')
      }
      onUploadDocument?.(file, documentName, DocumentUploadStatus.Uploaded)
    } catch (err) {
      onError?.(documentName)
      onUploadDocument?.(file, documentName, DocumentUploadStatus.Error)
    }
  }, [
    checkApplicationDocumentsList,
    documentFile?.file,
    documentName,
    documentType,
    onError,
    onGetOrderId,
    onUploadDocument,
    uploadDocument,
  ])

  return { sendFile }
}

export { useUploadDocument }
