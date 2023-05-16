import { Box } from '@mui/material'

import { dealerAdditionalServices } from 'common/FullOrderCalculator/__tests__/FullOrderCalculator.mock'
import { creditProducts } from 'common/OrderCalculator/__tests__/OrderCalculator.mock'
import { FormFieldNameMap, LOAN_TERM } from 'entities/OrderCalculator'
import { AreaFooter, useInitialPayment } from 'entities/OrderCalculator'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { AdditionalEquipment } from './AdditionalEquipment/AdditionalEquipment'
import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import useStyles from './OrderSettingsArea.styles'

export function OrderSettingsArea() {
  const classes = useStyles()

  const { initialPaymentPercent, handleInitialPaymentPercentChange } = useInitialPayment(
    FormFieldNameMap.carCost,
    FormFieldNameMap.initialPayment,
  )

  return (
    <CollapsibleFormAreaContainer title="Параметры кредита">
      <Box className={classes.gridContainer}>
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
        />
        <Box gridColumn="span 1">
          <MaskedInput
            label="Первоначальный взнос в %"
            placeholder="-"
            mask={maskPercent}
            value={initialPaymentPercent || ''}
            onChange={handleInitialPaymentPercentChange}
            id="initialPaymentPercent"
            InputProps={{ endAdornment: '%' }}
          />
        </Box>
        <SelectInputFormik
          name={FormFieldNameMap.loanTerm}
          label="Срок"
          placeholder="-"
          options={LOAN_TERM}
          gridColumn="span 1"
        />
      </Box>

      <AdditionalEquipment />
      <AdditionalServices
        title="Дополнительные услуги дилера"
        options={dealerAdditionalServices}
        name={FormFieldNameMap.dealerAdditionalServices}
      />
      <AdditionalServices
        title="Дополнительные услуги банка"
        options={[]}
        name={FormFieldNameMap.bankAdditionalServices}
        disabled
      />
      <AreaFooter btnTitle="Рассчитать" btnType="submit" />
    </CollapsibleFormAreaContainer>
  )
}
