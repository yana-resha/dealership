import React, { useState } from 'react'

import { Link } from '@mui/material'
import { Box } from '@mui/system'
import cx from 'classnames'
import { useSnackbar } from 'notistack'

import { CircularProgressWheel } from '../CircularProgressWheel/CircularProgressWheel'
import useStyles from './Downloader.styles'

type DownloaderIconProps = {
  onDownloadFile: () => Promise<File | undefined>
  gridColumn?: string
  disabled?: boolean
}

export function Downloader({
  onDownloadFile,
  gridColumn,
  disabled = false,
  children,
}: React.PropsWithChildren<DownloaderIconProps>) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | undefined>()

  const handleDownload = async () => {
    if (disabled) {
      return
    }
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
    <Box data-testid="downloaderIcon" display="flex" alignItems="center" gridColumn={gridColumn}>
      {file ? (
        <Link
          data-testid="downloaderLink"
          href={disabled ? undefined : preview}
          className={cx(classes.fileLink, { [classes.disabledFileLink]: disabled })}
          target="_blank"
          download={file?.name}
        >
          {children}
        </Link>
      ) : (
        <Link
          data-testid="downloaderLinkDownloader"
          className={cx(classes.fileLink, { [classes.disabledFileLink]: disabled })}
          onClick={handleDownload}
        >
          {!isLoading && children}
          {isLoading && <CircularProgressWheel />}
        </Link>
      )}
    </Box>
  )
}
