import { Box } from '@mui/material'
import { ArrayHelpers } from 'formik'

import { useAdditionalServices } from 'entities/OrderCalculator'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './AdditionalServiceItem.styles'

interface Props {
  options: string[]
  parentName: string
  index: number
  productLabel: string
  arrayHelpers: ArrayHelpers
  arrayLength: number
  changeIds: (idx: number, changingOption: string, minItems?: number) => void
  isError: boolean
}

export function AdditionalServiceItem({
  options,
  parentName,
  productLabel,
  index,
  arrayLength,
  arrayHelpers,
  changeIds,
  isError,
}: Props) {
  const classes = useStyles()
  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
  })

  return (
    <Box className={classes.gridContainer}>
      <SelectInputFormik
        name={`${namePrefix}productType`}
        label={productLabel}
        placeholder="-"
        options={options}
        gridColumn="span 2"
        disabled={isError}
      />
      <MaskedInputFormik
        name={`${namePrefix}productCost`}
        label="Стоимость"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 1"
        disabled={isError}
      />

      <Box className={classes.switchContainer} gridColumn="span 1">
        <SwitchInputFormik name={`${namePrefix}isCredit`} label="В кредит" disabled={isError} />
      </Box>
      {!isError && (
        <Box className={classes.btnContainer} gridColumn="span 1">
          <CloseSquareBtn onClick={removeItem} />
          <AddingSquareBtn onClick={addItem} />
        </Box>
      )}
    </Box>
  )
}
