import { ChangeEvent, memo, useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { ReactComponent as AttachIcon } from 'assets/icons/attach.svg'

import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB, maxFileSizeBite } from '../../config/uploadFile.config'
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
  buttonText?: string
  onChange: (files: FileList) => void
  multiple?: boolean
}

const FileUploadButton = ({ buttonText = 'Загрузите файл', onChange, multiple }: Props) => {
  const styles = useStyles()

  const [isVisible, setIsVisible] = useState(false)

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
    [onChange],
  )

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  return (
    <Box>
      <Button
        classes={{ root: styles.root, startIcon: styles.startIcon }}
        startIcon={<AttachIcon />}
        component="label"
      >
        <input
          data-testid="fileUploadButtonInput"
          hidden
          multiple={multiple}
          type="file"
          accept={ALLOWED_FILE_TYPES}
          onChange={onChangeInput}
        />
        {buttonText}
      </Button>

      <ModalDialog isVisible={isVisible} label="Файл слишком большой" onClose={onClose}>
        <SberTypography sberautoVariant="body3" component="p">
          Максимальный размер файла: {MAX_FILE_SIZE_MB} МБ
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
