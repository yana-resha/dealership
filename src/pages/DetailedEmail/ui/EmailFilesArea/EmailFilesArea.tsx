import { useCallback } from 'react'

import { Box } from '@mui/material'
import { AttachedFiles } from '@sberauto/emailappdc-proto/public'

import { EmailFileDownloader } from 'entities/downloader/EmailFileDownloader/EmailFileDownloader'
import { useDownloadEmailDocMutation } from 'shared/api/requests/emailAppDc.api'
import { DEFAULT_FILE_NAME } from 'shared/config/fileLoading.config'
import { AreaContainer } from 'shared/ui/DossierAreaContainer'
import { EmailFileMetadata } from 'shared/ui/FileDownloader/FileDownloader'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useStyles } from './EmailFilesArea.styles'

type Props = {
  files: AttachedFiles[] | null | undefined
}

export function EmailFilesArea({ files }: Props) {
  const classes = useStyles()
  const { mutateAsync: downloadEmailDoc } = useDownloadEmailDocMutation()

  const downloadFile = useCallback(
    async (fileMeta: EmailFileMetadata) => {
      const { fileId, name } = fileMeta
      const file = await downloadEmailDoc({ fileId })

      return new File([file], name || DEFAULT_FILE_NAME, { type: file.type })
    },
    [downloadEmailDoc],
  )

  return (
    <AreaContainer>
      <Box className={classes.areaContainer}>
        <SberTypography sberautoVariant="h5" component="p">
          Вложенные файлы
        </SberTypography>
        {!!files?.length && (
          <Box gridColumn="1 / -1" className={classes.documentsBlock}>
            {files.map((file, index) => (
              <EmailFileDownloader
                key={index}
                fileOrMetadata={{ fileId: file.fileId ?? 0, name: file?.fileName }}
                index={index}
                loadingMessage="Файл загружается"
                onDownloadEmailFiles={downloadFile}
              />
            ))}
          </Box>
        )}
      </Box>
    </AreaContainer>
  )
}
