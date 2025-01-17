import { useCallback, useEffect } from 'react'

import { Box, Button, Typography } from '@mui/material'
import { useFormikContext } from 'formik'

import { ReactComponent as CloseIcon } from 'assets/icons/cancel.svg'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { CustomTooltip } from 'shared/ui/CustomTooltip'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { ClientData } from '../../ClientForm.types'
import { IncomeProofUploadArea } from '../IncomeProofUploadArea/IncomeProofUploadArea'
import useStyles from './IncomesArea.styles'

export function IncomesArea() {
  const classes = useStyles()
  const incomeProduct = useAppSelector(
    state => state.order.order?.orderData?.application?.loanData?.incomeProduct,
  )
  const { values, setFieldValue, setFieldTouched } = useFormikContext<ClientData>()
  const { occupation, incomeConfirmation, isIncomeProofUploaderTouched } = values

  const handleSwitch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setFieldValue('isIncomeProofUploaderTouched', event.target.checked),
    [setFieldValue],
  )
  const handleIncomCancel = useCallback(
    () => setFieldValue('isIncomeProofUploaderTouched', false),
    [setFieldValue],
  )

  useEffect(() => {
    if (!incomeConfirmation) {
      setFieldValue('ndfl2File', null)
      setFieldValue('ndfl3File', null)
      setFieldValue('bankStatementFile', null)
    }
  }, [incomeConfirmation, setFieldValue])

  useEffect(() => {
    if (!occupation && isIncomeProofUploaderTouched) {
      setFieldTouched('occupation', true)
    }
  }, [incomeConfirmation, isIncomeProofUploaderTouched, occupation, setFieldTouched])

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Доходы</Typography>
      </Box>

      <MaskedInputFormik
        name="averageIncome"
        label="Среднемесячный доход"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 4"
      />
      <MaskedInputFormik
        name="additionalIncome"
        label="Дополнительный личный доход"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 4"
      />
      <MaskedInputFormik
        name="familyIncome"
        label="Доход семьи без дохода заявит."
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 4"
      />
      <Box gridColumn="span 4">
        <CustomTooltip arrow title={<span>Подтверждение среднемесячного дохода</span>}>
          <Box className={classes.incomeConfirmationContainer}>
            <SwitchInputFormik
              name="incomeConfirmation"
              label="Подтверждение"
              centered
              disabled={incomeProduct}
              onChange={handleSwitch}
            />
          </Box>
        </CustomTooltip>
      </Box>

      {((incomeProduct && !isIncomeProofUploaderTouched) || (incomeConfirmation && !!occupation)) && (
        <IncomeProofUploadArea />
      )}

      {isIncomeProofUploaderTouched && !occupation && (
        <Box className={classes.docError} gridColumn="1/-1">
          <SberTypography sberautoVariant="body3" component="p" data-testid="hasNotOccupationErr">
            Перед загрузкой подтверждения заполните поле &quot;Должность/Вид занятости&quot;
          </SberTypography>

          {incomeProduct && (
            <Button className={classes.cancelButton} component="label" onClick={handleIncomCancel}>
              <CloseIcon />
            </Button>
          )}
        </Box>
      )}

      <SwitchInputFormik
        name="relatedToPublic"
        label="Клиент принадлежит к категории публичных лиц"
        gridColumn="1/9"
      />
    </Box>
  )
}
