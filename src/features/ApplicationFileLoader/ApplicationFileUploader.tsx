import { memo, useCallback, useEffect, useMemo } from 'react'

import { Box, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'

import { DragAndDropWrapper } from 'shared/ui/DragAndDropWrapper'
import { FileDownloader } from 'shared/ui/FileDownloader'
import { FileUploadButton } from 'shared/ui/FileUploadButton'
import SberTypography from 'shared/ui/SberTypography'

import useStyles from './ApplicationFileUploader.styles'
import { FileInfo, UploaderConfig, DocumentUploadStatus } from './ApplicationFileUploader.types'
import { useDownloadDocument } from './hooks/useDownloadDocument'
import { useUploadDocument } from './hooks/useUploadDocument'

type UploaderProps = {
  uploaderConfig: UploaderConfig
  suggest?: string
  loadingMessage?: string
  motivateMessage?: string
  /** Если хотим чтобы форма не только выводила файл, но и могла изменять и выгружать его на бэк.
   * Меняет внешний вид компонента */
  onUploadDocument?: (file: File, documentName: string, status: FileInfo['status']) => void
  onDeleteDocument?: (documentName: string) => void
  onError?: (documentName: string) => void
  isAllowedUploadToServer?: boolean
}

/** Позволяет загружать и выгружать файлы по заявке */
const Uploader: React.FC<UploaderProps> = props => {
  const {
    uploaderConfig,
    suggest,
    loadingMessage,
    motivateMessage,
    onUploadDocument,
    onDeleteDocument,
    onError,
    isAllowedUploadToServer = true,
  } = props
  const { documentLabel, documentName, documentFile } = uploaderConfig || {}
  const isShowInput = !!onUploadDocument
  const isLoading = documentFile?.status === DocumentUploadStatus.Progress
  const isError = !!uploaderConfig.documentError || documentFile?.status === DocumentUploadStatus.Error
  const errorMessage = uploaderConfig.documentError ?? 'Не удалось загрузить файл'

  const classes = useStyles()

  const { sendFile } = useUploadDocument({ uploaderConfig, onError, onUploadDocument })
  const { downloadFile } = useDownloadDocument()

  const handleUpload = useCallback(
    (files: FileList) => {
      const file = files.item(0)

      if (file) {
        onUploadDocument?.(file, documentName, DocumentUploadStatus.Local)
      }
    },
    [documentName, onUploadDocument],
  )

  const handleDelete = useMemo(
    () =>
      onDeleteDocument
        ? () => {
            onDeleteDocument?.(documentName)
          }
        : undefined,
    [documentName, onDeleteDocument],
  )

  useEffect(() => {
    // Если компонент может только отображать файл, но не может выгружать
    if (!isShowInput) {
      return
    }
    const { file, status } = documentFile || {}
    if (file && status === DocumentUploadStatus.Local && isAllowedUploadToServer) {
      sendFile()
    }
    // Удален sendFile - вызывал бесконечный ререндер из-за своей зависимости onGetOrderId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentFile, isAllowedUploadToServer, isShowInput])

  if (!isShowInput) {
    if (!documentFile?.file) {
      return null
    }

    return (
      <Box>
        <Box className={classes.documentPreview}>
          <SberTypography sberautoVariant="body3" component="p">
            {documentLabel}
          </SberTypography>

          <FileDownloader
            file={documentFile?.file}
            loadingMessage={loadingMessage}
            index={0}
            onClickDelete={handleDelete}
            onDownloadFile={downloadFile}
          />
        </Box>
        {isError && <FormHelperText error>{errorMessage}</FormHelperText>}
      </Box>
    )
  }

  return (
    <Box className={classes.documentSection}>
      <>
        <DragAndDropWrapper onChange={handleUpload}>
          <SberTypography sberautoVariant="h6" component="p">
            {documentLabel}
          </SberTypography>
          {!!suggest && (
            <SberTypography sberautoVariant="body3" component="p" className={classes.sectionInfo}>
              {suggest}
            </SberTypography>
          )}

          <Stack direction="row">
            <Box gridColumn="1 / -1" className={classes.item} display="flex" alignItems="center">
              {documentFile?.file && !isLoading ? (
                <FileDownloader
                  file={documentFile?.file}
                  loadingMessage={loadingMessage}
                  index={0}
                  onClickDelete={handleDelete}
                  onDownloadFile={downloadFile}
                />
              ) : (
                <FileUploadButton
                  buttonText={motivateMessage}
                  onChange={handleUpload}
                  isUploading={isLoading}
                />
              )}
            </Box>
          </Stack>
        </DragAndDropWrapper>

        {isError && <FormHelperText error>{errorMessage}</FormHelperText>}
      </>
    </Box>
  )
}

const MemoUploader = memo(Uploader)
export { MemoUploader as Uploader }
