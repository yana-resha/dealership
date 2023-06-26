import { useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'
import { useFormikContext } from 'formik'

import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { SPECIAL_MARK_OPTIONS } from 'entities/SpecialMark'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import { useAppSelector } from '../../shared/hooks/store/useAppSelector'
import { useStyles } from './FraudDialog.styles'

export const FraudDialog = () => {
  const classes = useStyles()
  const { setFieldValue } = useFormikContext()
  const [isVisible, setIsVisible] = useState(false)
  const savedApplication = useAppSelector(state => state.order.order)
  const [fraudReason, setFraudReason] = useState(savedApplication?.orderData?.application?.specialMark || '')
  const handleChange = useCallback(
    (fieldValue: string) => {
      setFraudReason(fieldValue)
    },
    [setFraudReason],
  )

  const openFraudDialog = useCallback(() => {
    setIsVisible(true)
  }, [setIsVisible])

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  const onSubmit = useCallback(() => {
    setIsVisible(false)
    setFieldValue(FormFieldNameMap.specialMark, fraudReason)
  }, [fraudReason, setFieldValue])

  return (
    <Box className={classes.fraudButtonContainer}>
      <Button
        classes={{ root: classes.root, startIcon: classes.startIcon }}
        startIcon={<WarningIcon />}
        component="label"
        onClick={openFraudDialog}
      >
        Специальная отметка
      </Button>
      <ModalDialog isVisible={isVisible} label="Специальная отметка" onClose={onClose}>
        <SberTypography sberautoVariant="body3" component="p">
          Если у вас есть подозрение на мошенничество, то выберите один из пунктов меню, банк примет эти
          данные к сведению при рассмотрении кредитной заявки.
        </SberTypography>
        <SelectInput
          value={fraudReason}
          id="fraudReason"
          onChange={handleChange}
          label="Варианты"
          placeholder="-"
          options={SPECIAL_MARK_OPTIONS}
          emptyAvailable
        />
        <Button onClick={onSubmit} variant="contained" className={classes.submitBtn}>
          Сохранить
        </Button>
      </ModalDialog>
    </Box>
  )
}
