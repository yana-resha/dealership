import React, { DragEvent, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import cx from 'classnames'

import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../config/uploadFile.config'
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
}

export const DragAndDropWrapper = ({ onChange, children }: PropsWithChildren<Props>) => {
  const styles = useStyles()
  const [isShowDropArea, setIsShowDropArea] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [errorLabel, setErrorLabel] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const onEnter = useCallback(() => {
    setIsShowDropArea(true)
  }, [setIsShowDropArea])
  const onLeave = useCallback(() => {
    setIsShowDropArea(false)
  }, [setIsShowDropArea])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      onLeave()
      const { files } = e.dataTransfer
      if (files != null) {
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i)
          if (file != null) {
            if (file.size > MAX_FILE_SIZE) {
              setErrorLabel('Файл слишком большой')
              setErrorMessage('Максимальный размер файла: 5 МБ')
              setIsVisible(true)

              return
            }
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
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
    [onChange, onLeave],
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
