import { useEffect } from 'react'

import { Box } from '@mui/material'
import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { ArrayHelpers, useField, useFormikContext } from 'formik'

import { INITIAL_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { FormFieldNameMap, OrderCalculatorFields } from 'common/OrderCalculator/types'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { useAdditionalServices } from 'entities/application/AdditionalOptionsRequisites/hooks/useAdditionalServices'
import { useAdditionalServicesOptions } from 'entities/application/AdditionalOptionsRequisites/hooks/useAdditionalServicesOptions'
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

  const { namePrefix, isLastItem, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
    initialValues: INITIAL_ADDITIONAL_SERVICE,
  })
  const [productTypeField] = useField<OptionID>(namePrefix + FormFieldNameMap.productType)
  const { values, submitCount } = useFormikContext<OrderCalculatorFields>()

  const { filteredOptions, shouldDisableAdding } = useAdditionalServicesOptions({
    values,
    index,
    parentName,
    options,
  })

  const isShouldShowCascoLimitField =
    isNecessaryCasco &&
    parentName === ServicesGroupName.dealerAdditionalServices &&
    productTypeField.value === OptionID.CASCO

  const [, cascoLimitMeta, { setTouched: setCascoLimitTouched }] = useField<string>(
    namePrefix + FormFieldNameMap.cascoLimit,
  )
  useEffect(() => {
    if (isShouldShowCascoLimitField && !cascoLimitMeta.touched && !!submitCount) {
      setCascoLimitTouched(true)
    }
    // Исключили setCascoLimitTouched что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cascoLimitMeta.touched, isShouldShowCascoLimitField, submitCount])

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
          {isLastItem && <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />}
          <CloseSquareBtn onClick={removeItem} />
        </Box>
      )}
    </Box>
  )
}
