import { useCallback } from 'react'

import { Box } from '@mui/material'
import { ArrayHelpers, useFormikContext } from 'formik'

import { maskOnlyNumbersWithSeparator } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './AdditionalServiceItem.styles'

const MIN_ITEMS_LENGTH = 1

interface Props {
  options: string[]
  parentName: string
  index: number
  productLabel: string
  arrayHelpers: ArrayHelpers
  arrayLength: number
}

export function AdditionalServiceItem({
  options,
  parentName,
  productLabel,
  index,
  arrayLength,
  arrayHelpers,
}: Props) {
  const classes = useStyles()
  // TODO DCB-200: Прописать тип, когда появится структура от Бэка
  const { initialValues } = useFormikContext<any>()

  const namePrefix = `${parentName}.${index}.`

  const removeItem = useCallback(
    () =>
      arrayLength > MIN_ITEMS_LENGTH
        ? arrayHelpers.remove(index)
        : arrayHelpers.replace(index, initialValues[parentName][0]),
    [arrayHelpers, arrayLength, index, initialValues, parentName],
  )
  const addItem = useCallback(
    () => arrayHelpers.insert(index + 1, initialValues[parentName][0]),
    [arrayHelpers, index, initialValues, parentName],
  )

  return (
    <Box className={classes.gridContainer}>
      <SelectInputFormik
        name={`${namePrefix}productType`}
        label={productLabel}
        placeholder="-"
        options={options}
        gridColumn="span 2"
      />
      <MaskedInputFormik
        name={`${namePrefix}productCost`}
        label="Стоимость"
        placeholder="-"
        mask={maskOnlyNumbersWithSeparator}
        gridColumn="span 1"
      />

      <Box className={classes.switchContainer} gridColumn="span 1">
        <SwitchInputFormik name={`${namePrefix}isCredit`} label="В кредит" />
      </Box>
      <Box className={classes.btnContainer} gridColumn="span 1">
        <CloseSquareBtn onClick={removeItem} />
        <AddingSquareBtn onClick={addItem} />
      </Box>
    </Box>
  )
}
