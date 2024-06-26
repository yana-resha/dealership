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
  const [file, setFile] = useState<FileOrMetadata | undefined>(fileOrMetadata)

  const downloadDocument = async () => {
    if (onDownloadDocuments) {
      setIsLoading(true)
      try {
        const downloadedFile = await onDownloadDocuments(file as DocumentsFileMetadata)

        const downloadURL = URL.createObjectURL(downloadedFile)
        const simulateLink = document.createElement('a')
        simulateLink.href = downloadURL
        simulateLink.download = transformFileName(documentType, dcAppId) || downloadedFile.name
        simulateLink.click()
        URL.revokeObjectURL(downloadURL)
        setFile(downloadedFile)
      } catch (error) {
        console.error('Error downloading the file:', error)
      }
      setIsLoading(false)
    }
  }

  const removeFile = useCallback(() => {
    if (onClickRemove) {
      onClickRemove(index)
    }
    setFile(fileOrMetadata)
  }, [onClickRemove, fileOrMetadata, index])

  return (
    <FileDownloader
      index={index}
      isLoading={isLoading}
      fileOrMetadata={file}
      loadingMessage={loadingMessage}
      onClick={onClick}
      dcAppId={dcAppId}
      documentType={documentType}
      onDownloadFile={downloadDocument}
      onClickRemove={removeFile}
    />
  )
}
