import { Box } from '@mui/material'

import { creditProducts } from 'common/OrderCalculator/__tests__/OrderCalculator.mock'
import { additionalEquipments } from 'common/OrderCalculator/__tests__/OrderCalculator.mock'
import { dealerAdditionalServices } from 'common/OrderCalculator/__tests__/OrderCalculator.mock'
import { FormFieldNameMap, LOAN_TERM } from 'entities/orderCalculator'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import useStyles from './OrderSettingsArea.styles'

type Props = {
  disabled: boolean
}
export function OrderSettingsArea({ disabled }: Props) {
  const classes = useStyles()

  return (
    <CollapsibleFormAreaContainer
      title="Параметры кредита"
      disabled={disabled}
      shouldExpanded={disabled ? false : undefined}
    >
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
        <SelectInputFormik
          name={FormFieldNameMap.loanTerm}
          label="Срок"
          placeholder="-"
          options={LOAN_TERM}
          gridColumn="span 1"
        />
      </Box>

      <AdditionalServices
        title="Дополнительное оборудование"
        options={additionalEquipments}
        name={FormFieldNameMap.additionalEquipments}
        productLabel="Вид оборудования"
      />
      <AdditionalServices
        title="Дополнительные услуги дилера"
        options={dealerAdditionalServices}
        name={FormFieldNameMap.dealerAdditionalServices}
        productLabel="Тип продукта"
      />
      <AdditionalServices
        disabled
        title="Дополнительные услуги банка"
        options={[]}
        name={FormFieldNameMap.bankAdditionalServices}
        productLabel="Тип продукта"
      />
    </CollapsibleFormAreaContainer>
  )
}
