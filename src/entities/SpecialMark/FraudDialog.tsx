import { useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { ReactComponent as Close } from 'assets/icons/cancel.svg'
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg'
import { updateOrder } from 'entities/order'
import { SPECIAL_MARK_OPTIONS } from 'entities/SpecialMark'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import { useStyles } from './FraudDialog.styles'

export const FraudDialog = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const savedApplication = useAppSelector(state => state.order.order)
  const application = savedApplication?.orderData?.application
  const specialMark = application?.specialMark
  const [fraudReason, setFraudReason] = useState(specialMark || '')
  const specialMarkClasses = classNames({
    [classes.root]: !specialMark,
    [classes.rootActive]: specialMark,
  })
  const handleChange = useCallback(
    (fieldValue: string) => {
      setFraudReason(fieldValue)
    },
    [setFraudReason],
  )

  const deleteSpecialMark = useCallback(() => {
    dispatch(
      updateOrder({ orderData: { ...savedApplication, application: { ...application, specialMark: '' } } }),
    )
    setFraudReason('')
  }, [application, dispatch, savedApplication])

  const openFraudDialog = useCallback(() => {
    setFraudReason(specialMark || '')
    setIsVisible(true)
  }, [specialMark])

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  const onSubmit = useCallback(() => {
    setIsVisible(false)
    dispatch(
      updateOrder({
        orderData: { ...savedApplication, application: { ...application, specialMark: fraudReason } },
      }),
    )
  }, [application, dispatch, fraudReason, savedApplication])

  return (
    <Box className={classes.fraudButtonContainer}>
      <Button
        classes={{ root: specialMarkClasses, startIcon: classes.startIcon }}
        startIcon={<WarningIcon />}
        component="label"
        onClick={openFraudDialog}
      >
        <Box minWidth="max-content">Специальная отметка</Box>
      </Button>
      {specialMark && (
        <Button className={classes.cancelButton} component="label" onClick={deleteSpecialMark}>
          <Close />
        </Button>
      )}
      <ModalDialog isVisible={isVisible} label="Специальная отметка" onClose={onClose}>
        <Box className={classes.dialogContent}>
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
        </Box>
      </ModalDialog>
    </Box>
  )
}
