import { PropsWithChildren } from 'react'

import { Box, Dialog, IconButton } from '@mui/material'
import cx from 'classnames'

import { ReactComponent as Close } from 'assets/icons/close.svg'

import SberTypography from '../SberTypography/SberTypography'
import { useStyles } from './ModalDialog.styles'

type Props = {
  isVisible: boolean
  label?: string
  onClose: () => void
  testId?: string
  paperClassName?: string
}

export const ModalDialog = (props: PropsWithChildren<Props>) => {
  const styles = useStyles()
  const { isVisible, label, onClose, testId, children, paperClassName } = props

  return (
    <Dialog
      classes={{ paper: cx(styles.dialogBlock, paperClassName) }}
      open={isVisible}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
    >
      <Box display="flex" overflow="visible" data-testid={testId}>
        {!!label && (
          <SberTypography sberautoVariant="h5" component="p" className={styles.label}>
            {label}
          </SberTypography>
        )}
        <IconButton className={styles.closeButton} onClick={onClose} data-testid="modalDialogClose">
          <Close />
        </IconButton>
      </Box>
      {children}
    </Dialog>
  )
}
