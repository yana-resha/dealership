import { useCallback, useRef } from 'react'

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
import { useField, useFormikContext } from 'formik'

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { FormFieldNameMap } from 'entities/OrderCalculator'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { SPECIAL_MARK_OPTIONS } from './SpecialMarkModal.config'
import { useStyles } from './SpecialMarkModal.styles'

type Props = {
  isVisible: boolean
  onClose: () => void
}
// TODO DCB-200 Вынести в общий компонент - такой же компонент используется в экране анкета
export function SpecialMarkModal({ isVisible, onClose }: Props) {
  const classes = useStyles()
  const [field] = useField(FormFieldNameMap.specialMark)
  const { setFieldValue } = useFormikContext()
  const initialValue = useRef(field.value)

  const handleClose = useCallback(() => {
    setFieldValue(FormFieldNameMap.specialMark, initialValue.current)
    onClose()
  }, [onClose, setFieldValue])

  const handleSubmit = useCallback(() => {
    initialValue.current = field.value
    onClose()
  }, [field.value, onClose])

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
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
        <DialogContent>
          <DialogTitle className={cx(classes.modalText, classes.modalTitle)}>Специальная отметка</DialogTitle>
          <DialogContentText className={classes.modalText}>
            Если у вас есть подозрение на мошенничество, то выберите один из пунктов меню, банк примет эти
            данные к сведению при рассмотрении кредитной заявки.
          </DialogContentText>
          <Box className={classes.specialMark}>
            <SelectInputFormik
              name={FormFieldNameMap.specialMark}
              label="Варианты"
              placeholder="-"
              options={SPECIAL_MARK_OPTIONS}
              emptyAvailable
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            fullWidth
            className={classes.confirmBtn}
            onClick={handleSubmit}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Box>
      <IconButton size="small" className={classes.closeBtn} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Dialog>
  )
}
