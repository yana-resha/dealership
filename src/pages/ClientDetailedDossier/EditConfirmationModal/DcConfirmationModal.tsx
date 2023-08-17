import React, { useCallback } from 'react'

import { Box, Button, DialogContentText } from '@mui/material'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'

import { useStyles } from './DcConfirmationModal.styles'

type Props = {
  confirmedAction?: () => void
  actionText: string
  isVisible: boolean
  onClose: () => void
}

export function DcConfirmationModal({ confirmedAction, actionText, isVisible, onClose }: Props) {
  const classes = useStyles()
  const vendor = getPointOfSaleFromCookies()

  const performConfirmedAction = useCallback(() => {
    confirmedAction?.()
  }, [confirmedAction])

  return (
    <ModalDialog isVisible={isVisible} onClose={onClose}>
      <Box className={classes.contentContainer}>
        <DialogContentText className={classes.dialogText}>{actionText}</DialogContentText>
        <DialogContentText className={classes.dialogText}>
          {vendor.vendorName}, {vendor.address}
        </DialogContentText>
        <DialogContentText className={classes.dialogText}>Все верно?</DialogContentText>
        <Box className={classes.buttonsContainer}>
          <Button
            variant="contained"
            autoFocus
            onClick={performConfirmedAction}
            className={classes.dialogBtn}
          >
            Да
          </Button>
          <Button variant="outlined" onClick={onClose} className={classes.dialogBtn}>
            Нет
          </Button>
        </Box>
      </Box>
    </ModalDialog>
  )
}