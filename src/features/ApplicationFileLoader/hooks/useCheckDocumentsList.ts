import { useCallback, useEffect, useRef } from 'react'

import { DocumentType, UploadDocument } from '@sberauto/loanapplifecycledc-proto/public'

import { useGetApplicationDocumentsListMutation } from 'shared/api/requests/loanAppLifeCycleDc'

const ATTEMPT_LIMIT = 10
const TIMEOUT = 12
const INTERVAL = 1

export interface RequiredUploadDocument extends UploadDocument {
  documentType: DocumentType
  fileName: string
}

/** Проверяет подтверждение о загрузке */
export const useCheckDocumentsList = () => {
  const timerIdRef = useRef<any | null>(null)
  const timeoutErrIdRef = useRef<any | null>(null)

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
  const checkApplicationDocumentsList = useCallback(
    (
      dcAppId: string,
      documentTypes: DocumentType[],
      options?: {
        attemptLimit?: number
        timeout?: number
        interval?: number
      },
    ) =>
      new Promise<RequiredUploadDocument[]>((resolve, reject) => {
        const attemptLimit = options?.attemptLimit || ATTEMPT_LIMIT
        const timeout = options?.timeout || TIMEOUT
        const interval = options?.interval || INTERVAL

        clearTimeout(timeoutErrIdRef.current)
        /** Если в течении 12 секунд нет ответа, то вызываем ошибку по таймауту */
        timeoutErrIdRef.current = setTimeout(() => reject(new Error('Timeout')), timeout * 1000)

        async function checkFile(attempt = 1) {
          try {
            const response = await getApplicationDocumentsList({
              dcAppId: dcAppId,
              documentTypeList: documentTypes,
            })
            const uploadedDocuments = (response.uploadDocumentList?.filter(
              doc => doc.fileName && documentTypes.find(type => type === doc.documentType),
            ) || []) as RequiredUploadDocument[]

            if (uploadedDocuments.length === documentTypes.length) {
              return resolve(uploadedDocuments)
            }
            if (attemptLimit !== 0 && attempt >= attemptLimit) {
              return resolve([])
            }

            clearTimeout(timerIdRef.current)
            timerIdRef.current = setTimeout(() => checkFile(attempt + 1), interval * 1000)
          } catch (err) {
            reject(err)
          }
        }

        checkFile()
      }),
    [getApplicationDocumentsList],
  )

  return { checkApplicationDocumentsList }
}
