import React, { useState } from 'react'

import { Link } from '@mui/material'
import { Box } from '@mui/system'
import cx from 'classnames'
import { useSnackbar } from 'notistack'

import { FILE_DOWNLOAD_ERROR } from '../../constants/constants'
import { CircularProgressWheel } from '../CircularProgressWheel/CircularProgressWheel'
import useStyles from './Downloader.styles'

type DownloaderIconProps = {
  onDownloadFile: () => Promise<File | undefined>
  gridColumn?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export function Downloader({
  onDownloadFile,
  gridColumn,
  disabled = false,
  icon,
  children,
}: React.PropsWithChildren<DownloaderIconProps>) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | undefined>()

  const isDisabled = disabled || isLoading

  const handleDownload = async () => {
    if (isDisabled) {
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
        enqueueSnackbar(FILE_DOWNLOAD_ERROR, {
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
          className={cx(classes.fileLink, { [classes.disabledFileLink]: isDisabled })}
          target="_blank"
          download={file?.name}
        >
          <Box className={classes.contentContainer}>
            {icon}
            {children}
          </Box>
        </Link>
      ) : (
        <Link
          data-testid="downloaderLinkDownloader"
          className={cx(classes.fileLink, { [classes.disabledFileLink]: isDisabled })}
          onClick={handleDownload}
        >
          <Box className={classes.contentContainer}>
            {isLoading ? <CircularProgressWheel /> : icon}
            {children}
          </Box>
        </Link>
      )}
    </Box>
  )
}
