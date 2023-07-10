import { Box } from '@mui/material'
import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { ArrayHelpers, useField, useFormikContext } from 'formik'

import { INITIAL_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { FormFieldNameMap, OrderCalculatorFields } from 'common/OrderCalculator/types'
import { useAdditionalServices } from 'entities/application/DossierAreas/hooks/useAdditionalServices'
import {
  ServicesGroupName,
  useAdditionalServicesOptions,
} from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './AdditionalServiceItem.styles'

interface Props {
  options: { value: string | number; label: string }[]
  parentName: ServicesGroupName
  isNecessaryCasco: boolean
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
  isNecessaryCasco,
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
    initialValues: INITIAL_ADDITIONAL_SERVICE,
  })
  const [productTypeField] = useField<OptionID>(namePrefix + FormFieldNameMap.productType)

  const isShouldShowCascoLimitField =
    isNecessaryCasco &&
    parentName === ServicesGroupName.dealerAdditionalServices &&
    productTypeField.value === OptionID.CASCO

  const { values } = useFormikContext<OrderCalculatorFields>()
  const { filteredOptions, shouldDisableAdding } = useAdditionalServicesOptions({
    values,
    index,
    parentName,
    options,
  })

  return (
    <Box className={classes.gridContainer}>
      <SelectInputFormik
        name={namePrefix + FormFieldNameMap.productType}
        label={productLabel}
        placeholder="-"
        options={filteredOptions}
        gridColumn="span 2"
        disabled={isError}
      />
      <Box gridColumn="span 1" className={classes.costContainer}>
        <MaskedInputFormik
          name={namePrefix + FormFieldNameMap.productCost}
          label="Стоимость"
          placeholder="-"
          mask={maskOnlyDigitsWithSeparator}
          disabled={isError}
        />
        {isShouldShowCascoLimitField && (
          <MaskedInputFormik
            name={namePrefix + FormFieldNameMap.cascoLimit}
            label="Сумма покрытия КАСКО"
            placeholder="-"
            mask={maskOnlyDigitsWithSeparator}
            disabled={isError}
          />
        )}
      </Box>

      <Box className={classes.switchContainer} gridColumn="span 1">
        <SwitchInputFormik
          name={namePrefix + FormFieldNameMap.isCredit}
          label="В кредит"
          disabled={isError}
        />
      </Box>

      {!isError && (
        <Box className={classes.btnContainer} gridColumn="span 1">
          <CloseSquareBtn onClick={removeItem} />
          <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />
        </Box>
      )}
    </Box>
  )
}
