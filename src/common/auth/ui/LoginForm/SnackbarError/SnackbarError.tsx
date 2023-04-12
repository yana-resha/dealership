import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { AlertTitle } from '@mui/material'
import Alert from '@mui/material/Alert'
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'

interface SnackbarErrorProps {}

export interface SnackbarErrorRef {
  show: (title: string, text: string) => void
}

const SnackbarError = forwardRef<SnackbarErrorRef, SnackbarErrorProps>((props, ref) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const handleClose: SnackbarProps['onClose'] = (_, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  useImperativeHandle(ref, () => ({
    show(title: string, text: string) {
      setTitle(title)
      setText(text)
      setOpen(true)
    },
  }))

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert elevation={6} variant="filled" severity="error" sx={{ width: '100%' }}>
        {!!title && <AlertTitle>{title}</AlertTitle>}
        {text}
      </Alert>
    </Snackbar>
  )
})

export default SnackbarError
