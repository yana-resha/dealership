import { useEffect, useState } from 'react'

import { Avatar, IconButton, Link } from '@mui/material'
import { Box } from '@mui/system'
import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { ReactComponent as Close } from 'assets/icons/close.svg'
import documentIcon from 'assets/icons/document.svg'
import { transformFileName } from 'shared/utils/fileLoading'

import { CircularProgressWheel } from '../CircularProgressWheel/CircularProgressWheel'
import SberTypography from '../SberTypography'
import { useStyles } from './FileDownloader.styles'

/** Данные о файле по которым его можно подтянуть с бэка,
 * файл прилетает в base64  а не в виде url, поэтому грузить сразу расточительно */
export type DocumentsFileMetadata = {
  dcAppId: string
  documentType: number
  name?: string
}

export type EmailFileMetadata = {
  fileId: number
  name?: string
}

type FileOrMetadata = File | DocumentsFileMetadata | EmailFileMetadata

type FileDownloaderProps = {
  index: number
  loadingMessage?: string
  dcAppId?: string
  documentType?: DocumentType
  onClick?: () => void
  onClickRemove?: (index: number) => void
  isLoading: boolean
  fileOrMetadata: FileOrMetadata | undefined
  onDownloadFile?: () => Promise<void>
}

export const FileDownloader = ({
  index,
  dcAppId,
  documentType,
  onClick,
  loadingMessage,
  onClickRemove,
  isLoading,
  fileOrMetadata,
  onDownloadFile,
}: FileDownloaderProps) => {
  const styles = useStyles()
  // Локальное хранение файла сделано для того,
  // чтобы можно было скачивать его без повторного запроса к бэку (пока мы не уйдем со страницы)
  const [file, setFile] = useState<FileOrMetadata | undefined>(fileOrMetadata)

  const isFileObject = (input: FileOrMetadata | undefined): input is File => input instanceof File

  /** Скачиваем файл полученный при запросе по метаинформации о нем */
  const handleDownload = async () => {
    if (isFileObject(file) || isLoading) {
      return
    }

    if (onDownloadFile) {
      await onDownloadFile()
    }
  }

  // Необходим, чтобы при смене пропса, менялся и локальный стэйт file.
  // В противном случае будет отображаться и скачиваться старый файл
  useEffect(() => {
    setFile(file)
  }, [file])

  const preview = isFileObject(file) && file ? URL.createObjectURL(file) : undefined
  const message = loadingMessage ? loadingMessage : 'Файл загружается...'
  const fileName = file?.name || 'Файл'

  return (
    <Box
      data-testid="uploadFile"
      display="flex"
      alignItems="center"
      gap={1}
      onClick={onClick}
      className={styles.fileDownloaderContainer}
    >
      {isFileObject(file) ? (
        <Link
          href={preview}
          className={styles.fileLink}
          target="_blank"
          download={transformFileName(documentType, dcAppId) || file?.name}
          gap={1}
        >
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
        <IconButton data-testid="deleteFileButton" size="small" onClick={() => onClickRemove(index)}>
          <Close />
        </IconButton>
      )}
    </Box>
  )
}
