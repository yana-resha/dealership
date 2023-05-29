import { Box } from '@mui/material'
import { ArrayHelpers, useField } from 'formik'

import { useAdditionalServices } from 'common/OrderCalculator/hooks/useAdditionalServices'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import {
  agent,
  provider,
} from 'common/OrderCalculator/ui/FullOrderCalculator/__tests__/FullOrderCalculator.mock'
import { BankDetails } from 'common/OrderCalculator/ui/FullOrderCalculator/FormContainer/BankDetails/BankDetails'
import { maskDigitsOnly, maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './AdditionalServiceItem.styles'

type Props = {
  options: {
    productType: { value: string | number; label: string }[]
    loanTerms: { value: string | number }[]
  }
  parentName: string
  index: number
  arrayHelpers: ArrayHelpers
  arrayLength: number
  changeIds: (idx: number, changingOption: string, minItems?: number) => void
}

export function AdditionalServiceItem({
  options,
  parentName,
  index,
  arrayLength,
  arrayHelpers,
  changeIds,
}: Props) {
  const classes = useStyles()
  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
  })

  const [isCreditField] = useField(namePrefix + FormFieldNameMap.isCredit)

  return (
    <Box className={classes.itemContainer}>
      <Box className={classes.gridContainer} gridColumn="span 5">
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.productType}
          label="Тип продукта"
          placeholder="-"
          options={options.productType}
          gridColumn="span 2"
        />
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.provider}
          label="Страховая компания или поставщик"
          placeholder="-"
          options={provider}
          gridColumn="span 2"
        />

        <Box className={classes.actionContainer} gridColumn="span 1">
          <Box className={classes.switchContainer} gridColumn="span 1">
            <SwitchInputFormik name={namePrefix + FormFieldNameMap.isCredit} label="В кредит" />
          </Box>
          <Box className={classes.btnContainer} gridColumn="span 1">
            <CloseSquareBtn onClick={removeItem} />
            <AddingSquareBtn onClick={addItem} />
          </Box>
        </Box>
      </Box>

      <Box className={classes.gridContainer} gridColumn="span 5">
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.agent}
          label="Агент"
          placeholder="-"
          options={agent}
          gridColumn="span 2"
        />

        <MaskedInputFormik
          name={namePrefix + FormFieldNameMap.productCost}
          label="Стоимость"
          placeholder="-"
          mask={maskOnlyDigitsWithSeparator}
          gridColumn="span 1"
        />

        {!!isCreditField.value && (
          <>
            <SelectInputFormik
              name={namePrefix + FormFieldNameMap.loanTerm}
              label="Срок"
              placeholder="-"
              options={options.loanTerms}
              gridColumn="span 1"
            />
            <MaskedInputFormik
              name={namePrefix + FormFieldNameMap.documentId}
              label="Номер документа"
              placeholder="-"
              mask={maskDigitsOnly}
              gridColumn="span 1"
            />
          </>
        )}
      </Box>
      <BankDetails namePrefix={namePrefix} />
    </Box>
  )
}
