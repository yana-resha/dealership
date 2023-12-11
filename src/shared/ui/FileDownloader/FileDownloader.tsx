import { useCallback, useState } from 'react'

import { Avatar, IconButton, Link } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'

import { ReactComponent as Close } from 'assets/icons/close.svg'
import documentIcon from 'assets/icons/document.svg'

import { CircularProgressWheel } from '../CircularProgressWheel/CircularProgressWheel'
import SberTypography from '../SberTypography'

const useStyles = makeStyles(theme => ({
  avatar: {
    '&.MuiAvatar-root': {
      width: 32,
      height: 32,
      backgroundColor: 'transparent',
    },
  },
  text: {
    color: theme.palette.primary.main,
  },
  fileLink: {
    '&.MuiLink-root': {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      gap: theme.spacing(1),
      cursor: 'pointer',
      width: 'fit-content',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    margin: 'auto',
  },
}))

/** Данные о файле по которым его можно подтянуть с бэка,
 * файл прилетает в base64  а не в виде url, поэтому грузить сразу расточительно */
export type FileMetadata = {
  dcAppId: string
  documentType: number
  name?: string
}

type FileOrMetadata = File | FileMetadata

type FileDownloaderProps = {
  fileOrMetadata: FileOrMetadata | undefined
  index: number
  loadingMessage?: string
  onClick?: () => void
  onClickRemove?: (index: number) => void
  onDownloadFile?: (metadata: FileMetadata) => Promise<File>
}

export const FileDownloader = ({
  fileOrMetadata,
  index,
  onClick,
  loadingMessage,
  onClickRemove,
  onDownloadFile,
}: FileDownloaderProps) => {
  const styles = useStyles()

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<FileOrMetadata | undefined>(fileOrMetadata)

  const isFileObject = (input: FileOrMetadata | undefined): input is File => input instanceof File

  /** Скачиваем файл полученный при запросе по метаинформации о нем */
  const handleDownload = async () => {
    if (isFileObject(file)) {
      return
    }

    if (onDownloadFile && !isFileObject(file) && file) {
      setIsLoading(true)
      try {
        const downloadedFile = await onDownloadFile(file)

        const downloadURL = URL.createObjectURL(downloadedFile)
        const simulateLink = document.createElement('a')
        simulateLink.href = downloadURL
        simulateLink.download = downloadedFile.name
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

  const preview = isFileObject(file) && file ? URL.createObjectURL(file) : undefined
  const message = loadingMessage ? loadingMessage : 'Файл загружается...'
  const nameMaxLength = 30
  const fileName = file?.name
    ? file.name?.length > nameMaxLength
      ? file.name.slice(0, nameMaxLength) + '...'
      : file.name
    : 'Файл'

  return (
    <Box data-testid="uploadFile" display="flex" alignItems="center" gap={1} onClick={onClick}>
      {isFileObject(file) ? (
        <Link href={preview} className={styles.fileLink} target="_blank" download={file?.name} gap={1}>
          {preview ? (
            <Avatar variant="square" className={styles.avatar}>
              <img
                width="100%"
                height="100%"
                src={file && file.type.includes('image') ? preview : documentIcon}
              />
            </Avatar>
          ) : (
            <Box className={styles.loaderContainer}>
              <CircularProgressWheel size="small" />
            </Box>
          )}

          <SberTypography className={styles.text} sberautoVariant="body3" component="p">
            {file ? fileName : message}
          </SberTypography>
        </Link>
      ) : (
        <Link href="#" onClick={handleDownload} className={styles.fileLink}>
          {isLoading ? (
            <Box className={styles.loaderContainer}>
              <CircularProgressWheel size="small" />
            </Box>
          ) : (
            <Avatar variant="square" className={styles.avatar}>
              <img width="100%" height="100%" src={documentIcon} />
            </Avatar>
          )}

          <SberTypography className={styles.text} sberautoVariant="body3" component="p">
            {file ? fileName : message}
          </SberTypography>
        </Link>
      )}

      {onClickRemove && (
        <IconButton data-testid="deleteFileButton" size="small" onClick={removeFile}>
          <Close />
        </IconButton>
      )}
    </Box>
  )
}
