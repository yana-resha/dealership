import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material'
import cx from 'classnames'

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { ReactComponent as NoMatchesCircleIcon } from 'assets/icons/noMatchesCircle.svg'

import { useStyles } from './NoMatchesModal.styles'

type Props = {
  isVisible: boolean
  onClose: () => void
}
export function NoMatchesModal({ isVisible, onClose }: Props) {
  const classes = useStyles()

  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      classes={{
        paper: classes.modalWrapper,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        className={classes.modalContainer}
        data-testid="noMatchesModal"
      >
        <DialogContent className={classes.modalContent}>
          <NoMatchesCircleIcon />
          <DialogTitle className={cx(classes.modalText, classes.modalTitle)}>
            Совпадения не найдены
          </DialogTitle>
          <DialogContentText className={classes.modalText}>
            Проверьте правильность заполнения данных
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" autoFocus fullWidth className={classes.confirmBtn} onClick={onClose}>
            Хорошо, спасибо
          </Button>
        </DialogActions>
      </Box>
      <IconButton size="small" className={classes.closeBtn} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Dialog>
  )
}
