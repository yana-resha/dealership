import { useState } from 'react'

import { EmailFileMetadata, FileDownloader } from 'shared/ui/FileDownloader/FileDownloader'

type FileOrMetadata = File | EmailFileMetadata

type EmailFileDownloaderProps = {
  fileOrMetadata: FileOrMetadata | undefined
  index: number
  loadingMessage?: string
  onClick?: () => void
  onDownloadEmailFiles?: (metadata: EmailFileMetadata) => Promise<File>
}
export const EmailFileDownloader = ({
  fileOrMetadata,
  index,
  loadingMessage,
  onClick,
  onDownloadEmailFiles,
}: EmailFileDownloaderProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const downloadEmailFile = async () => {
    if (onDownloadEmailFiles) {
      setIsLoading(true)
      try {
        const downloadedFile = await onDownloadEmailFiles(fileOrMetadata as EmailFileMetadata)

        const downloadURL = URL.createObjectURL(downloadedFile)
        const simulateLink = document.createElement('a')
        simulateLink.href = downloadURL
        simulateLink.download = downloadedFile.name
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

  return (
    <FileDownloader
      index={index}
      isLoading={isLoading}
      fileOrMetadata={fileOrMetadata}
      loadingMessage={loadingMessage}
      onClick={onClick}
      onDownloadFile={downloadEmailFile}
    />
  )
}
