import { Box } from '@mui/material'

import { useCreditProductsLimits } from 'common/OrderCalculator/hooks/useCreditProductsLimits'
import { useGovernmentPrograms } from 'common/OrderCalculator/hooks/useGovernmentPrograms'
import { useInitialPayment } from 'common/OrderCalculator/hooks/useInitialPayment'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { RequiredProduct } from 'entities/order/model/orderSlice'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { GovernmentProgram } from '../GovernmentProgram/GovernmentProgram'
import useStyles from './CommonOrderSettings.styles'

type Props = {
  disabled: boolean
  minInitialPaymentPercent: number
  maxInitialPaymentPercent: number
  minInitialPayment: number
  maxInitialPayment: number
  currentProduct: RequiredProduct | undefined
  loanTerms: { value: number }[]
  durationMaxFromAge: number
  currentDurationMin: number | undefined
  currentDurationMax: number | undefined
  isGetCarsLoading: boolean
  isGetCarsSuccess: boolean
}

export function CommonOrderSettings({
  disabled,
  minInitialPaymentPercent,
  maxInitialPaymentPercent,
  minInitialPayment,
  maxInitialPayment,
  currentProduct,
  loanTerms,
  durationMaxFromAge,
  isGetCarsLoading,
  isGetCarsSuccess,
}: Props) {
  const classes = useStyles()

  const {
    governmentPrograms,
    isGovernmentProgramSelected,
    isGovernmentProgramEnabled,
    productIdsForGovernmentProgram,
  } = useGovernmentPrograms()

  const { creditProducts, initialPaymentHelperText, initialPaymentPercentHelperText } =
    useCreditProductsLimits({
      minInitialPaymentPercent,
      maxInitialPaymentPercent,
      minInitialPayment,
      maxInitialPayment,
      currentProduct,
      durationMaxFromAge,
      isGetCarsLoading,
      isGetCarsSuccess,
      productIdsForGovernmentProgram,
    })

  const {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  } = useInitialPayment(disabled)

  return (
    <Box className={classes.gridContainer} data-testid="CommonOrderSettings">
      {isGovernmentProgramEnabled && <GovernmentProgram governmentPrograms={governmentPrograms} />}

      <SelectInputFormik
        name={FormFieldNameMap.creditProduct}
        label="Кредитный продукт"
        placeholder="-"
        options={creditProducts}
        gridColumn="span 2"
        emptyAvailable
        disabled={isGovernmentProgramEnabled && !isGovernmentProgramSelected}
      />
      <MaskedInputFormik
        name={FormFieldNameMap.initialPayment}
        label="Первоначальный взнос"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 1"
        helperMessage={initialPaymentHelperText}
        InputProps={{ onFocus: handleInitialPaymentFocus, onBlur: handleInitialPaymentBlur }}
      />
      <MaskedInputFormik
        name={FormFieldNameMap.initialPaymentPercent}
        label="Первоначальный взнос в %"
        placeholder="-"
        mask={maskPercent}
        gridColumn="span 1"
        helperMessage={initialPaymentPercentHelperText}
        InputProps={{
          onFocus: handleInitialPaymentPercentFocus,
          onBlur: handleInitialPaymentPercentBlur,
        }}
      />
      <SelectInputFormik
        name={FormFieldNameMap.loanTerm}
        label="Срок"
        placeholder="-"
        options={loanTerms}
        gridColumn="span 1"
      />
    </Box>
  )
}
