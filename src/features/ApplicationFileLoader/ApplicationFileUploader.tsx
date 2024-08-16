import { memo, useCallback, useEffect, useMemo } from 'react'

import { Box, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { DocumentDownloader } from 'entities/downloader/DocumentsDownloader'
import { DragAndDropWrapper } from 'shared/ui/DragAndDropWrapper'
import { FileUploadButton } from 'shared/ui/FileUploadButton'
import SberTypography from 'shared/ui/SberTypography'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import useStyles from './ApplicationFileUploader.styles'
import { FileInfo, UploaderConfig, DocumentUploadStatus } from './ApplicationFileUploader.types'
import { useDownloadDocument } from './hooks/useDownloadDocument'
import { useUploadDocument } from './hooks/useUploadDocument'

const RENAMING_TOOLTIP = 'Наименования файла было изменено системой'

type UploaderProps = {
  uploaderConfig: UploaderConfig
  suggest?: string
  loadingMessage?: string
  motivateMessage?: string
  /** Если хотим чтобы форма не только выводила файл, но и могла изменять и выгружать его на бэк.
   * Меняет внешний вид компонента */
  onUploadDocument?: (file: File, documentName: string, status: FileInfo['status']) => void
  onRemoveDocument?: (documentName: string) => void
  onChangeOption?: (documentName: string, documentType: string | DocumentType) => void
  onError?: (documentName: string) => void
  isAllowedUploadToServer?: boolean
  isRemoveDisabled?: boolean
  isShowLabel?: boolean
}

/** Позволяет загружать и выгружать файлы по заявке */
const Uploader: React.FC<UploaderProps> = ({
  uploaderConfig,
  suggest,
  loadingMessage,
  motivateMessage,
  onUploadDocument,
  onRemoveDocument,
  onChangeOption,
  onError,
  isAllowedUploadToServer = true,
  isRemoveDisabled = false,
  isShowLabel = false,
}) => {
  const { documentLabel, documentName, documentFile, documentType, documentError, documentTypeOptions } =
    uploaderConfig || {}
  const isShowInput = !!onUploadDocument
  const isLoading = documentFile?.status === DocumentUploadStatus.Progress
  const isError = !!documentError || documentFile?.status === DocumentUploadStatus.Error
  const errorMessage = documentError ?? 'Не удалось загрузить файл'

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

  const handleRemove = useMemo(
    () =>
      onRemoveDocument && !isRemoveDisabled
        ? () => {
            onRemoveDocument(documentName)
          }
        : undefined,
    [documentName, isRemoveDisabled, onRemoveDocument],
  )

  const handleChangeOption = useCallback(
    (type: string | DocumentType) => onChangeOption && onChangeOption(documentName, type),
    [documentName, onChangeOption],
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
      <Box data-testid="uploaderContainer">
        <Box className={classes.documentPreview}>
          {isShowLabel && (
            <SberTypography sberautoVariant="body3" component="p" data-testid="documentLabel">
              {documentLabel}
            </SberTypography>
          )}

          <DocumentDownloader
            fileOrMetadata={documentFile?.file}
            loadingMessage={loadingMessage}
            index={0}
            onClickRemove={handleRemove}
            onDownloadDocuments={downloadFile}
            tooltipText={RENAMING_TOOLTIP}
          />
        </Box>
        {isError && (
          <FormHelperText error data-testid="errorMessage">
            {errorMessage}
          </FormHelperText>
        )}
      </Box>
    )
  }

  return (
    <Box className={classes.documentSection} data-testid="uploaderDragAndDropContainer">
      <>
        <DragAndDropWrapper onChange={handleUpload}>
          {isShowLabel && (
            <SberTypography sberautoVariant="h6" component="p" data-testid="documentLabel">
              {documentLabel}
            </SberTypography>
          )}

          {!!suggest && (
            <SberTypography
              sberautoVariant="body3"
              component="p"
              className={classes.sectionInfo}
              data-testid="suggestion"
            >
              {suggest}
            </SberTypography>
          )}

          {!!documentTypeOptions && (
            <SelectInput
              options={documentTypeOptions}
              onChange={handleChangeOption}
              label="Тип документа"
              placeholder="-"
              value={documentType || undefined}
              disabled={documentFile?.file && !isLoading}
            />
          )}

          {!!documentType && (
            <>
              <Stack direction="row" className={classes.stack}>
                <Box gridColumn="1 / -1" className={classes.item} display="flex" alignItems="center">
                  {documentFile?.file && !isLoading ? (
                    <DocumentDownloader
                      fileOrMetadata={documentFile?.file}
                      loadingMessage={loadingMessage}
                      index={0}
                      onClickRemove={handleRemove}
                      onDownloadDocuments={downloadFile}
                      tooltipText={RENAMING_TOOLTIP}
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
            </>
          )}
        </DragAndDropWrapper>

        {isError && <FormHelperText error>{errorMessage}</FormHelperText>}
      </>
    </Box>
  )
}

const MemoUploader = memo(Uploader)
export { MemoUploader as Uploader }
