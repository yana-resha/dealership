import { useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'

import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg'
import { SPECIAL_MARK_OPTIONS, useSpecialMarkContext } from 'entities/SpecialMark'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import { useStyles } from './FraudDialog.styles'

export const FraudDialog = () => {
  const classes = useStyles()
  const { specialMark, onChangeSpecialMark } = useSpecialMarkContext()
  const [isVisible, setIsVisible] = useState(false)
  const [fraudReason, setFraudReason] = useState(specialMark)
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
    onChangeSpecialMark(fraudReason)
  }, [fraudReason, onChangeSpecialMark])

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
