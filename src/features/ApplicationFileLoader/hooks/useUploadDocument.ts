import { useCallback } from 'react'

import { useApplicationContext } from 'entities/applications/ApplicationProvider'
import { useCheckDocumentsList } from 'features/ApplicationFileLoader/hooks/useCheckDocumentsList'
import { useUploadDocumentMutation } from 'shared/api/requests/loanAppLifeCycleDc'
import { UPLOADED_FILE_NAME_MAP } from 'shared/config/fileLoading.config'

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
    if (!file || !checkIsFile(file) || !documentType) {
      return
    }

    const extension = file.name.split('.').pop()
    const newName = UPLOADED_FILE_NAME_MAP[documentType]
      ? `${UPLOADED_FILE_NAME_MAP[documentType]}.${extension}`
      : `${documentName}.${extension}`

    const renamedFile = new File([file], newName, {
      type: file.type,
      lastModified: file.lastModified,
    })

    onUploadDocument?.(renamedFile, documentName, DocumentUploadStatus.Progress)
    try {
      const dcAppId = await onGetOrderId?.()
      if (!dcAppId) {
        throw new Error('dcAppId is empty')
      }

      await uploadDocumentMutate({
        dcAppId,
        file: renamedFile,
        documentType,
      })
      onUploadDocument?.(renamedFile, documentName, DocumentUploadStatus.Sended)

      // Опрашиваем бэк о статусе загрузки файлов
      const uploadedDocuments = await checkApplicationDocumentsList(dcAppId, [documentType])
      if (!uploadedDocuments.length) {
        throw new Error('Failed to upload the document')
      }
      onUploadDocument?.(renamedFile, documentName, DocumentUploadStatus.Uploaded)
    } catch (err) {
      onError?.(documentName)
      onUploadDocument?.(renamedFile, documentName, DocumentUploadStatus.Error)
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
