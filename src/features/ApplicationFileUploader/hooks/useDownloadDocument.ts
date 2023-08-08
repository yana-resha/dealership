import { useCallback } from 'react'

import {
  useDownloadDocumentMutation,
  useGetApplicationDocumentsListMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'

/** Загружает файл с сервера */
const useDownloadDocument = () => {
  const { mutateAsync: downloadDocument } = useDownloadDocumentMutation()
  const { mutateAsync: getApplicationDocumentsList } = useGetApplicationDocumentsListMutation()

  const downloadFile = useCallback(
    async (metafile: { dcAppId: string; documentType: number; fileName?: string }) => {
      const { dcAppId, documentType, fileName = 'Файл' } = metafile

      const file = await downloadDocument({ dcAppId, documentType })
      let fullName = `${fileName}.${file.name?.split('.').at(-1)}`

      try {
        const response = await getApplicationDocumentsList({
          dcAppId: dcAppId,
          documentTypeList: [documentType],
        })
        const fileInfo = response?.uploadDocumentList?.[0]
        fullName = fileInfo?.fileName ?? fullName
      } catch (err) {
        console.log('getApplicationDocumentsList err', err)
      }

      return new File([file], fullName)
    },
    [downloadDocument, getApplicationDocumentsList],
  )

  return { downloadFile }
}

export { useDownloadDocument }
