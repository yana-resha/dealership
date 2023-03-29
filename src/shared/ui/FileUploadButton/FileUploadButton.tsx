import React, { ChangeEvent, useCallback } from 'react'

import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { ReactComponent as AttachIcon } from 'assets/icons/attach.svg'

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
  buttonText: string
  onChange: (files: FileList) => void
  uniqName: string
  multiple?: boolean
}

export const FileUploadButton = ({ buttonText, onChange, uniqName, multiple }: Props) => {
  const styles = useStyles()

  const onChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.target.files?.length && onChange(e.target.files)
    },
    [onChange],
  )

  return (
    <Button
      classes={{ root: styles.root, startIcon: styles.startIcon }}
      startIcon={<AttachIcon />}
      component="label"
    >
      <input
        data-testid="fileUploadButtonInput"
        id={uniqName}
        hidden
        multiple={multiple}
        accept="image/*"
        type="file"
        onChange={onChangeInput}
      />

      {buttonText}
    </Button>
  )
}
