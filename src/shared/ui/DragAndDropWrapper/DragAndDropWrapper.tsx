import React, { DragEvent, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { makeStyles } from '@mui/styles'
import cx from 'classnames'

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

  const onEnter = useCallback(() => {
    setIsShowDropArea(true)
  }, [setIsShowDropArea])
  const onLeave = useCallback(() => {
    setIsShowDropArea(false)
  }, [setIsShowDropArea])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      onLeave()
      onChange(e.dataTransfer.files)
    },
    [onChange, onLeave],
  )

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
    </div>
  )
}
