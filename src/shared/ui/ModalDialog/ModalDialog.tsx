import React, { PropsWithChildren } from 'react'

import { Box, Dialog, IconButton } from '@mui/material'

import { ReactComponent as Close } from 'assets/icons/close.svg'

import SberTypography from '../SberTypography/SberTypography'
import { useStyles } from './ModalDialog.styles'

type Props = {
  isVisible: boolean
  label?: string
  onClose: () => void
  testId?: string
}

export const ModalDialog = (props: PropsWithChildren<Props>) => {
  const classes = useStyles()
  const { isVisible, label, onClose, testId, children } = props

  return (
    <Dialog
      classes={{ paper: classes.dialogBlock }}
      open={isVisible}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
    >
      <Box display="flex" overflow="visible" data-testid={testId}>
        {!!label && (
          <SberTypography sberautoVariant="h5" component="p" className={classes.label}>
            {label}
          </SberTypography>
        )}
        <IconButton className={classes.closeButton} onClick={onClose} data-testid="modalDialogClose">
          <Close />
        </IconButton>
      </Box>
      {children}
    </Dialog>
  )
}
