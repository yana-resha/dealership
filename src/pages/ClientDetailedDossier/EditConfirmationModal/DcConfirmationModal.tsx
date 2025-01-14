import { useCallback, useMemo } from 'react'

import { Box, Button, DialogContentText } from '@mui/material'
import compact from 'lodash/compact'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { transformAddress } from 'shared/lib/utils'
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
  const vendorAddress: string | undefined = useMemo(
    () => (vendor.address ? transformAddress(vendor.address) : undefined),
    [vendor.address],
  )

  return (
    <ModalDialog isVisible={isVisible} onClose={onClose}>
      <Box className={classes.contentContainer}>
        <DialogContentText className={classes.dialogText}>{actionText}</DialogContentText>
        <Box className={classes.dialogText}>
          <Box>{vendor.vendorName}</Box>
          {vendorAddress && <Box>{vendorAddress}</Box>}
        </Box>
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
