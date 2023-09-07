import { Box, Button } from '@mui/material'
import cx from 'classnames'

import { ReactComponent as NoMatchesCircleIcon } from 'assets/icons/noMatchesCircle.svg'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useStyles } from './NoMatchesModal.styles'

type Props = {
  isVisible: boolean
  onClose: () => void
}
export function NoMatchesModal({ isVisible, onClose }: Props) {
  const styles = useStyles()

  return (
    <ModalDialog
      isVisible={isVisible}
      onClose={onClose}
      testId="noMatchesModal"
      paperClassName={styles.modalPaper}
    >
      <Box className={styles.container}>
        <NoMatchesCircleIcon />
        <SberTypography sberautoVariant="h4" component="h4" className={cx(styles.text, styles.title)}>
          Совпадения не найдены
        </SberTypography>
        <SberTypography sberautoVariant="body3" component="p" className={styles.text}>
          Проверьте правильность заполнения данных
        </SberTypography>
        <Button variant="contained" autoFocus fullWidth className={styles.confirmBtn} onClick={onClose}>
          Хорошо, спасибо
        </Button>
      </Box>
    </ModalDialog>
  )
}
