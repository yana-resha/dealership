import { useCallback, useEffect, useRef } from 'react'

import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { useApplicationContext } from 'entities/application/ApplicationProvider'
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

  const timerIdRef = useRef<any | null>(null)
  const timeoutErrIdRef = useRef<any | null>(null)

  const { onGetOrderId } = useApplicationContext()
  const { mutateAsync: uploadDocument } = useUploadDocumentMutation()
  const { mutateAsync: getApplicationDocumentsList } = useGetApplicationDocumentsListMutation()

  /** Чистим таймауты */
  useEffect(
    () => () => {
      clearTimeout(timerIdRef.current)
      clearTimeout(timeoutErrIdRef.current)
    },
    [],
  )

  /** Опрашиваем бэк, ждем подтверждение о загрузке файла */
  const checkDocumentUploadStatus = useCallback(
    (dcAppId: string, documentType: DocumentType) =>
      new Promise<void>((resolve, reject) => {
        const ATTEMPT_LIMIT = 10
        const TIMEOUT = 12

        clearTimeout(timeoutErrIdRef.current)
        /** Если в течении 12 секунд нет ответа, то вызываем ошибку по таймауту */
        timeoutErrIdRef.current = setTimeout(() => reject(new Error('Timeout')), TIMEOUT * 1000)

        async function checkFile(attempt: number = 0) {
          try {
            const response = await getApplicationDocumentsList({
              dcAppId: dcAppId,
              documentTypeList: [documentType],
            })
            const uploadedDocument = response.uploadDocumentList?.find(
              doc => doc.documentType === documentType,
            )

            if (uploadedDocument || attempt > ATTEMPT_LIMIT) {
              if (uploadedDocument?.fileName) {
                resolve()
              } else {
                reject(new Error('Failed to upload the document'))
              }
            } else {
              clearTimeout(timerIdRef.current)
              timerIdRef.current = setTimeout(() => checkFile(attempt + 1), 1000)
            }
          } catch (err) {
            reject(err)
          }
        }

        checkFile(0)
      }),
    [getApplicationDocumentsList],
  )

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

      // Опрашиваем бэк о статусе загрузки файлов
      await checkDocumentUploadStatus(dcAppId, documentType)
      onUploadDocument?.(file, documentName, DocumentUploadStatus.Upload)
    } catch (err) {
      console.log('Uploader.sendEvent err', err)
      onError?.(documentName)
      onUploadDocument?.(file, documentName, DocumentUploadStatus.Error)
    }
  }, [
    documentFile?.file,
    onUploadDocument,
    documentName,
    onGetOrderId,
    uploadDocument,
    documentType,
    checkDocumentUploadStatus,
    onError,
  ])

  return { sendFile }
}

export { useUploadDocument }
