import { useCallback, useState } from 'react'

import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { DocumentsFileMetadata, FileDownloader } from 'shared/ui/FileDownloader/FileDownloader'
import { transformFileName } from 'shared/utils/fileLoading'

type FileOrMetadata = File | DocumentsFileMetadata

type DocumentsDownloaderProps = {
  fileOrMetadata: FileOrMetadata | undefined
  index: number
  loadingMessage?: string
  dcAppId?: string
  documentType?: DocumentType
  onClick?: () => void
  onClickRemove?: (index: number) => void
  onDownloadDocuments?: (metadata: DocumentsFileMetadata) => Promise<File>
}
export const DocumentDownloader = ({
  fileOrMetadata,
  index,
  loadingMessage,
  dcAppId,
  documentType,
  onClick,
  onClickRemove,
  onDownloadDocuments,
}: DocumentsDownloaderProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const downloadDocument = async () => {
    if (onDownloadDocuments) {
      setIsLoading(true)
      try {
        const downloadedFile = await onDownloadDocuments(fileOrMetadata as DocumentsFileMetadata)
        const downloadURL = URL.createObjectURL(downloadedFile)
        const simulateLink = document.createElement('a')
        simulateLink.href = downloadURL
        simulateLink.download = transformFileName(documentType, dcAppId) || downloadedFile.name
        simulateLink.click()
        URL.revokeObjectURL(downloadURL)
        setIsLoading(false)

        return downloadedFile
      } catch (error) {
        console.error('Error downloading the file:', error)
        setIsLoading(false)
      }
    }
  }

  const removeFile = useCallback(() => {
    if (onClickRemove) {
      onClickRemove(index)
    }
  }, [onClickRemove, index])

  return (
    <FileDownloader
      index={index}
      isLoading={isLoading}
      fileOrMetadata={fileOrMetadata}
      loadingMessage={loadingMessage}
      onClick={onClick}
      dcAppId={dcAppId}
      documentType={documentType}
      onDownloadFile={downloadDocument}
      onClickRemove={removeFile}
    />
  )
}
