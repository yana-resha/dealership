import { DragEvent, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import cx from 'classnames'

import {
  DEFAULT_ALLOWED_FILE_TYPES,
  DEFAULT_MAX_FILE_SIZE_MB,
  defaultMaxFileSizeBite,
} from '../../config/fileLoading.config'
import { ModalDialog } from '../ModalDialog/ModalDialog'
import SberTypography from '../SberTypography/SberTypography'

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    gap: theme.spacing(2),
  },
  enterFocus: {
    border: `1px dashed ${theme.palette.grey[600]}`,
  },
  leaveFocus: {
    border: '1px dashed transparent',
  },
}))

type Props = {
  onChange: (files: FileList) => void
  disabled?: boolean
}

export const DragAndDropWrapper = ({ onChange, disabled = false, children }: PropsWithChildren<Props>) => {
  const styles = useStyles()
  const [isShowDropArea, setIsShowDropArea] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [errorLabel, setErrorLabel] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const onEnter = useCallback(() => {
    if (!disabled) {
      setIsShowDropArea(true)
    }
  }, [disabled])
  const onLeave = useCallback(() => {
    if (!disabled) {
      setIsShowDropArea(false)
    }
  }, [disabled])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (disabled) {
        return
      }
      onLeave()
      const { files } = e.dataTransfer
      if (files != null) {
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i)
          if (file != null) {
            if (file.size > defaultMaxFileSizeBite) {
              setErrorLabel('Файл слишком большой')
              setErrorMessage(`Максимальный размер файла: ${DEFAULT_MAX_FILE_SIZE_MB} МБ`)
              setIsVisible(true)

              return
            }
            if (!DEFAULT_ALLOWED_FILE_TYPES.includes(file.type)) {
              setErrorLabel('Неверный тип файла')
              setErrorMessage('Разрешенные типы: jpg, png, pdf')
              setIsVisible(true)

              return
            }
          }
        }
      }
      onChange(e.dataTransfer.files)
    },
    [disabled, onChange, onLeave],
  )

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  // отключаем нативное поведение на всей странице,
  // что бы при промахах не открывался файл и не сбрасывались заполненные данные
  useEffect(() => {
    const suggestHandler = (e => {
      e.preventDefault()
      e.stopPropagation()
    }) as EventListener

    document.addEventListener('drag', suggestHandler)
    document.addEventListener('dragstart', suggestHandler)
    document.addEventListener('dragend', suggestHandler)
    document.addEventListener('dragover', suggestHandler)
    document.addEventListener('dragenter', suggestHandler)
    document.addEventListener('dragleave', suggestHandler)
    document.addEventListener('drop', suggestHandler)

    return () => {
      document.removeEventListener('drag', suggestHandler)
      document.removeEventListener('dragstart', suggestHandler)
      document.removeEventListener('dragend', suggestHandler)
      document.removeEventListener('dragover', suggestHandler)
      document.removeEventListener('dragenter', suggestHandler)
      document.removeEventListener('dragleave', suggestHandler)
      document.removeEventListener('drop', suggestHandler)
    }
  }, [])

  return (
    <div data-testid="dragAreaWrapper">
      <div
        data-testid="dragArea"
        className={cx(styles.wrapper, {
          [styles.enterFocus]: isShowDropArea,
          [styles.leaveFocus]: !isShowDropArea,
        })}
        onDragOver={onEnter}
        onDragLeave={onLeave}
        onDrop={onDrop}
      >
        {children}
      </div>
      <ModalDialog isVisible={isVisible} onClose={onClose} label={errorLabel}>
        <SberTypography sberautoVariant="body3" component="p">
          {errorMessage}
        </SberTypography>
        <Button onClick={onClose} variant="contained">
          ОК
        </Button>
      </ModalDialog>
    </div>
  )
}
