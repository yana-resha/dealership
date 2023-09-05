import React, { useState } from 'react'

import { Link } from '@mui/material'
import { Box } from '@mui/system'
import { useSnackbar } from 'notistack'

import { CircularProgressWheel } from '../CircularProgressWheel/CircularProgressWheel'
import useStyles from './Downloader.styles'

type DownloaderIconProps = {
  onDownloadFile: () => Promise<File | undefined>
}

export function Downloader({ onDownloadFile, children }: React.PropsWithChildren<DownloaderIconProps>) {
  const styles = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | undefined>()

  const handleDownload = async () => {
    if (onDownloadFile && !file) {
      setIsLoading(true)
      try {
        const downloadedFile = await onDownloadFile()

        if (!downloadedFile) {
          throw new Error('file is undefined')
        }

        const downloadURL = URL.createObjectURL(downloadedFile)
        const simulateLink = document.createElement('a')
        simulateLink.href = downloadURL
        simulateLink.download = downloadedFile.name
        simulateLink.click()
        URL.revokeObjectURL(downloadURL)

        setFile(downloadedFile)
      } catch (error) {
        console.error('Error downloading the file:', error)
        enqueueSnackbar('Ошибка. Не удалось скачать файл', {
          variant: 'error',
        })
      }
      setIsLoading(false)
    }
  }

  const preview = file ? URL.createObjectURL(file) : undefined

  return (
    <Box data-testid="downloaderIcon" display="flex" alignItems="center">
      {file ? (
        <Link
          data-testid="downloaderLink"
          href={preview}
          className={styles.fileLink}
          target="_blank"
          download={file?.name}
        >
          {children}
        </Link>
      ) : (
        <Link data-testid="downloaderLinkDownloader" className={styles.fileLink} onClick={handleDownload}>
          {!isLoading && children}
          {isLoading && <CircularProgressWheel />}
        </Link>
      )}
    </Box>
  )
}