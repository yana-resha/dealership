import { Box } from '@mui/material'
import { ArrayHelpers } from 'formik'

import {
  additionalEquipments,
  legalPersons,
} from 'common/FullOrderCalculator/__tests__/FullOrderCalculator.mock'
import { BankDetails } from 'common/FullOrderCalculator/FormContainer/BankDetails/BankDetails'
import { FormFieldNameMap, useAdditionalServices } from 'entities/orderCalculator'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './AdditionalEquipmentItem.styles'

type Props = {
  parentName: string
  index: number
  arrayHelpers: ArrayHelpers
  arrayLength: number
  changeIds: (idx: number, changingOption: string, minItems?: number) => void
}

export function AdditionalEquipmentItem({ parentName, index, arrayLength, arrayHelpers, changeIds }: Props) {
  const classes = useStyles()
  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
  })

  return (
    <Box className={classes.itemContainer}>
      <Box className={classes.gridContainer} gridColumn="span 5">
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.productType}
          label="Вид оборудования"
          placeholder="-"
          options={additionalEquipments}
          gridColumn="span 2"
        />
        <MaskedInputFormik
          name={namePrefix + FormFieldNameMap.productCost}
          label="Стоимость"
          placeholder="-"
          mask={maskOnlyDigitsWithSeparator}
          gridColumn="span 1"
        />

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

      <Box className={classes.gridContainer} gridColumn="span 5">
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.legalPerson}
          label="Юридическое лицо"
          placeholder="-"
          options={legalPersons}
          gridColumn="span 2"
        />
      </Box>
      <BankDetails namePrefix={namePrefix} />
    </Box>
  )
}
