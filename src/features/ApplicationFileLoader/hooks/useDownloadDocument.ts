import { useCallback } from 'react'

import {
  useDownloadDocumentMutation,
  useGetApplicationDocumentsListMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { DEFAULT_FILE_NAME } from 'shared/config/fileLoading.config'
import { FileMetadata } from 'shared/ui/FileDownloader/FileDownloader'

/** Загружает файл с сервера */
const useDownloadDocument = () => {
  const { mutateAsync: downloadDocument } = useDownloadDocumentMutation()
  const { mutateAsync: getApplicationDocumentsList } = useGetApplicationDocumentsListMutation()

  const downloadFile = useCallback(
    async (fileMeta: FileMetadata) => {
      const { dcAppId, documentType, name } = fileMeta
      const file = await downloadDocument({ dcAppId, documentType })

      if (!name) {
        try {
          const response = await getApplicationDocumentsList({
            dcAppId: dcAppId,
            documentTypeList: [documentType],
          })
          const fileInfo = response?.uploadDocumentList?.[0]

          return new File([file], fileInfo?.fileName || DEFAULT_FILE_NAME, { type: file.type })
        } catch (err) {
          console.log('getApplicationDocumentsList err', err)
        }
      }

      return new File([file], name || DEFAULT_FILE_NAME, { type: file.type })
    },
    [downloadDocument, getApplicationDocumentsList],
  )

  return { downloadFile }
}

export { useDownloadDocument }
