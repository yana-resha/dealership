import React, { PropsWithChildren } from 'react'

import { Box, Dialog, IconButton } from '@mui/material'

import { ReactComponent as Close } from 'assets/icons/close.svg'

import SberTypography from '../SberTypography/SberTypography'
import { useStyles } from './ModalDialog.styles'

type Props = {
  isVisible: boolean
  label: string
  onClose: () => void
}

export const ModalDialog = (props: PropsWithChildren<Props>) => {
  const classes = useStyles()
  const { isVisible, label, onClose, children } = props

  return (
    <Dialog
      classes={{ paper: classes.dialogBlock }}
      open={isVisible}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
    >
      <Box display="flex" overflow="visible">
        <SberTypography sberautoVariant="h5" component="p">
          {label}
        </SberTypography>
        <IconButton className={classes.closeButton} onClick={onClose} data-testid="modalDialogClose">
          <Close />
        </IconButton>
      </Box>
      {children}
    </Dialog>
  )
}