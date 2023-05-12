import { Box } from '@mui/material'

import { FormFieldNameMap, LOAN_TERM } from 'entities/orderCalculator'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { additionalEquipments, dealerAdditionalServices } from '../../__tests__/OrderCalculator.mock'
import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import useStyles from './OrderSettingsArea.styles'

export function OrderSettingsArea() {
  const classes = useStyles()

  return (
    <CollapsibleFormAreaContainer title="Параметры кредита">
      <Box className={classes.gridContainer}>
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
