import { Button } from '@mui/material'

import { ReactComponent as NoMatchesCircleIcon } from 'assets/icons/noMatchesCircle.svg'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useStyles } from './NoMatchesModal.styles'

type Props = {
  isVisible: boolean
  onClose: () => void
}
export function NoMatchesModal({ isVisible, onClose }: Props) {
  const classes = useStyles()

  return (
    <ModalDialog isVisible={isVisible} onClose={onClose} testId="noMatchesModal">
      <NoMatchesCircleIcon />
      <SberTypography sberautoVariant="h4" component="h4" className={classes.text}>
        Совпадения не найдены
      </SberTypography>
      <SberTypography sberautoVariant="body3" component="p" className={classes.text}>
        Проверьте правильность заполнения данных
      </SberTypography>
      <Button variant="contained" autoFocus fullWidth className={classes.confirmBtn} onClick={onClose}>
        Хорошо, спасибо
      </Button>
    </ModalDialog>
  )
}
