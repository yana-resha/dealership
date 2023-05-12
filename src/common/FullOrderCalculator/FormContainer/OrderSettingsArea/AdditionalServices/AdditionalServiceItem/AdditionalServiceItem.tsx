import { Box } from '@mui/material'
import { ArrayHelpers, useField } from 'formik'

import { agent, provider } from 'common/FullOrderCalculator/__tests__/FullOrderCalculator.mock'
import { BankDetails } from 'common/FullOrderCalculator/FormContainer/BankDetails/BankDetails'
import { FormFieldNameMap, LOAN_TERM, useAdditionalServices } from 'entities/orderCalculator'
import { maskDigitsOnly, maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './AdditionalServiceItem.styles'

type Props = {
  options: string[]
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

  const [isCreditField] = useField(namePrefix + FormFieldNameMap.isCreditAdditionalService)

  return (
    <Box className={classes.itemContainer}>
      <Box className={classes.gridContainer} gridColumn="span 5">
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.productType}
          label="Тип продукта"
          placeholder="-"
          options={options}
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
            <SwitchInputFormik
              name={namePrefix + FormFieldNameMap.isCreditAdditionalService}
              label="В кредит"
            />
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
              options={LOAN_TERM}
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
