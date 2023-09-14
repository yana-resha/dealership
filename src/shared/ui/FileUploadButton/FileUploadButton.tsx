import { ChangeEvent, memo, useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { ReactComponent as AttachIcon } from 'assets/icons/attach.svg'
import { megaBiteToBite } from 'shared/utils/megaBiteToBite'

import {
  DEFAULT_ALLOWED_FILE_TYPES,
  DEFAULT_MAX_FILE_SIZE_MB,
  defaultMaxFileSizeBite,
} from '../../config/uploadFile.config'
import { CircularProgressWheel } from '../CircularProgressWheel'
import { ModalDialog } from '../ModalDialog/ModalDialog'
import SberTypography from '../SberTypography/SberTypography'

const useStyles = makeStyles(theme => ({
  root: {
    '&.MuiButton-root:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    },
  },
  startIcon: {
    '&.MuiButton-startIcon': {
      marginRight: theme.spacing(2),
    },
  },
}))

type Props = {
  onChange: (files: FileList) => void
  icon?: React.ReactNode
  buttonText?: string
  multiple?: boolean
  allowedFileTypes?: string
  maxFileSizeMb?: number
  isUploading?: boolean
}

const FileUploadButton = ({
  onChange,
  icon,
  buttonText = 'Загрузите файл',
  multiple,
  allowedFileTypes,
  maxFileSizeMb,
  isUploading = false,
}: Props) => {
  const styles = useStyles()
  const [isVisible, setIsVisible] = useState(false)
  const maxFileSizeBite = maxFileSizeMb ? megaBiteToBite(maxFileSizeMb) : defaultMaxFileSizeBite

  const onChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target

      if (files != null) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxFileSizeBite) {
            setIsVisible(true)
            e.target.value = ''

            return
          }
        }
      }

      e.target.files?.length && onChange(e.target.files)
      e.target.value = ''
    },
    [maxFileSizeBite, onChange],
  )

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  return (
    <Box>
      <Button
        classes={{ root: styles.root, startIcon: styles.startIcon }}
        startIcon={isUploading ? <CircularProgressWheel size="small" /> : icon ?? <AttachIcon />}
        component="label"
      >
        <input
          data-testid="fileUploadButtonInput"
          hidden
          multiple={multiple}
          type="file"
          accept={allowedFileTypes ?? DEFAULT_ALLOWED_FILE_TYPES}
          onChange={onChangeInput}
        />
        {buttonText}
      </Button>

      <ModalDialog isVisible={isVisible} label="Файл слишком большой" onClose={onClose}>
        <SberTypography sberautoVariant="body3" component="p">
          Максимальный размер файла: {maxFileSizeMb ?? DEFAULT_MAX_FILE_SIZE_MB} МБ
        </SberTypography>
        <Button onClick={onClose} variant="contained">
          ОК
        </Button>
      </ModalDialog>
    </Box>
  )
}

const MemoFileUploadButton = memo(FileUploadButton)
export { MemoFileUploadButton as FileUploadButton }
