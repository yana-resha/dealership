import { Box } from '@mui/material'

import { useInitialPayment } from 'common/OrderCalculator/hooks/useInitialPayment'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './CommonOrderSettings.styles'

type Props = {
  disabled: boolean
  creditProducts: {
    value: string
    label: string
  }[]
  initialPaymentPercentHelperText: string
  initialPaymentHelperText: string
  loanTerms: { value: number }[]
}

export function CommonOrderSettings({
  disabled,
  creditProducts,
  initialPaymentHelperText,
  initialPaymentPercentHelperText,
  loanTerms,
}: Props) {
  const classes = useStyles()

  const {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  } = useInitialPayment(disabled)

  return (
    <Box className={classes.gridContainer} data-testid="CommonOrderSettings">
      <SelectInputFormik
        name={FormFieldNameMap.creditProduct}
        label="Кредитный продукт"
        placeholder="-"
        options={creditProducts}
        gridColumn="span 2"
        emptyAvailable
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
