import { useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'
import { useFormikContext } from 'formik'

import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg'
import { useSpecialMarkContext } from 'entities/SpecialMarkContext'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import { ClientData } from '../../ClientForm.types'
import { useStyles } from './FraudDialog.styles'

const SPECIAL_MARK = 'specialMark'
const SPECIAL_MARK_REASON = 'specialMarkReason'
const OPTIONS = [
  'Находится в присутствии 3х лиц ',
  'Находится в нетрезвом состоянии',
  'Подозрение на мошенничество',
]

export const FraudDialog = () => {
  const classes = useStyles()
  const { onChangeSpecialMark } = useSpecialMarkContext()
  const [isVisible, setIsVisible] = useState(false)
  const { values, setFieldValue } = useFormikContext<ClientData>()
  const { specialMarkReason } = values
  const [fraudReason, setFraudReason] = useState(specialMarkReason)

  const onChange = useCallback(
    (fieldValue: string) => {
      setFraudReason(fieldValue)
    },
    [setFraudReason],
  )

  const openFraudDialog = useCallback(() => {
    setIsVisible(true)
    setFraudReason(specialMarkReason)
  }, [setIsVisible, specialMarkReason])

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  const onSubmit = useCallback(() => {
    setIsVisible(false)
    setFieldValue(SPECIAL_MARK_REASON, fraudReason)
    setFieldValue(SPECIAL_MARK, fraudReason === '' ? false : true)
    onChangeSpecialMark(fraudReason)
  }, [setFieldValue, fraudReason, onChangeSpecialMark])

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
          onChange={onChange}
          label="Варианты"
          placeholder="-"
          options={OPTIONS}
          emptyAvailable
        />
        <Button onClick={onSubmit} variant="contained">
          Сохранить
        </Button>
      </ModalDialog>
    </Box>
  )
}
