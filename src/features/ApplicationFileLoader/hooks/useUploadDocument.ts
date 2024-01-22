import { useCallback } from 'react'

import { useApplicationContext } from 'entities/application/ApplicationProvider'
import { useCheckDocumentsList } from 'features/ApplicationFileLoader/hooks/useCheckDocumentsList'
import { useUploadDocumentMutation } from 'shared/api/requests/loanAppLifeCycleDc'

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
export const useUploadDocument = ({ uploaderConfig, onError, onUploadDocument }: UseUploadDocumentParams) => {
  const { documentName, documentFile, documentType } = uploaderConfig || {}

  const { onGetOrderId } = useApplicationContext()
  const { mutateAsync: uploadDocumentMutate } = useUploadDocumentMutation()
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

      await uploadDocumentMutate({
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
    uploadDocumentMutate,
  ])

  return { sendFile }
}
