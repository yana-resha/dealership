import { useEffect, useMemo } from 'react'

import { Box } from '@mui/material'
import { ArrayHelpers, useFormikContext } from 'formik'

import { INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { LOAN_TERM_GRADUATION_VALUE, MONTH_OF_YEAR_COUNT } from 'common/OrderCalculator/constants'
import { BankAdditionalOption } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import {
  FormFieldNameMap,
  BriefOrderCalculatorFields,
  OrderCalculatorBankAdditionalService,
} from 'common/OrderCalculator/types'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { useAdditionalServices } from 'entities/application/AdditionalOptionsRequisites/hooks/useAdditionalServices'
import { useAdditionalServicesOptions } from 'entities/application/AdditionalOptionsRequisites/hooks/useAdditionalServicesOptions'
import { checkIsNumber } from 'shared/lib/helpers'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'

import useStyles from './BankAdditionalService.styles'

type Props = {
  options: { value: string; label: string }[]
  additionalServices: BankAdditionalOption[]
  parentName: ServicesGroupName
  index: number
  productLabel: string
  arrayHelpers: ArrayHelpers
  arrayLength: number
  servicesItem: OrderCalculatorBankAdditionalService
  changeIds: (idx: number, changingOption: string, minItems?: number) => void
  isError: boolean
  clientAge: number
  selectedRequiredOptionsMap: Record<string, boolean>
}

export function BankAdditionalService({
  options,
  additionalServices,
  parentName,
  productLabel,
  index,
  arrayLength,
  arrayHelpers,
  changeIds,
  isError,
  servicesItem,
  clientAge,
  selectedRequiredOptionsMap,
}: Props) {
  const classes = useStyles()

  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields>()
  const { productType, tariff: currentTariffId, loanTerm } = servicesItem

  const { namePrefix, isLastItem, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
    initialValues: INITIAL_BANK_ADDITIONAL_SERVICE,
  })

  const { filteredOptions, shouldDisableAdding } = useAdditionalServicesOptions({
    values,
    index,
    parentName,
    options,
  })

  const tariffs = useMemo(
    () =>
      additionalServices
        .find(service => service.optionId === productType)
        ?.tariffs.filter(
          tariff =>
            !!tariff.tariffId &&
            tariff.tariff &&
            checkIsNumber(tariff?.maxClientAge) &&
            checkIsNumber(tariff?.maxTerm),
        ) || [],
    [additionalServices, productType],
  )

  const tariffOptions = useMemo(
    () => tariffs.map(tariff => ({ value: tariff.tariffId, label: tariff.tariff })),
    [tariffs],
  )

  const currentTariff = useMemo(
    () => tariffs.find(tariff => tariff.tariffId === currentTariffId),
    [currentTariffId, tariffs],
  )
  const loanTermOptions = useMemo(() => {
    if (!currentTariff) {
      return []
    }
    const maxLoanTermByClientAge = (currentTariff.maxClientAge + 1 - clientAge) * MONTH_OF_YEAR_COUNT
    const maxLoanTerm =
      currentTariff.maxTerm <= maxLoanTermByClientAge ? currentTariff.maxTerm : maxLoanTermByClientAge

    if (currentTariff.minTerm > maxLoanTerm || maxLoanTerm <= 0) {
      return []
    }
    const scaleLength = (maxLoanTerm - currentTariff.minTerm) / LOAN_TERM_GRADUATION_VALUE + 1
    const loanTerms = [...new Array(scaleLength)].map((v, i) => ({
      value: (i + 1) * LOAN_TERM_GRADUATION_VALUE + currentTariff.minTerm - LOAN_TERM_GRADUATION_VALUE,
    }))

    return loanTerms
  }, [clientAge, currentTariff])

  const isRequired = !!selectedRequiredOptionsMap[productType ?? '']

  useEffect(() => {
    if (!tariffOptions.some(option => option.value === currentTariffId)) {
      setFieldValue(namePrefix + FormFieldNameMap.tariff, INITIAL_BANK_ADDITIONAL_SERVICE.tariff)
    }
  }, [currentTariffId, namePrefix, setFieldValue, tariffOptions])

  useEffect(() => {
    if (!loanTermOptions.some(option => option.value === loanTerm)) {
      setFieldValue(namePrefix + FormFieldNameMap.loanTerm, INITIAL_BANK_ADDITIONAL_SERVICE.loanTerm)
    }
  }, [loanTerm, loanTermOptions, namePrefix, setFieldValue])

  useEffect(() => {
    if (currentTariff) {
      setFieldValue(namePrefix + FormFieldNameMap.productCost, currentTariff.price)
    } else {
      setFieldValue(namePrefix + FormFieldNameMap.productCost, INITIAL_BANK_ADDITIONAL_SERVICE.productCost)
    }
  }, [currentTariff, namePrefix, setFieldValue])

  return (
    <Box className={classes.gridContainer}>
      <SelectInputFormik
        name={namePrefix + FormFieldNameMap.productType}
        label={productLabel}
        placeholder="-"
        options={filteredOptions}
        gridColumn="span 3"
        disabled={isError || isRequired}
      />

      <SelectInputFormik
        name={namePrefix + FormFieldNameMap.tariff}
        label="Tариф"
        placeholder="-"
        options={tariffOptions}
        gridColumn="span 3"
        disabled={!tariffOptions.length || isError || isRequired}
      />

      <Box gridColumn="span 3" className={classes.bankCostContainer}>
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.loanTerm}
          label="Срок"
          placeholder="-"
          options={loanTermOptions}
          disabled={!loanTermOptions.length || isError}
        />

        <MaskedInputFormik
          name={namePrefix + FormFieldNameMap.productCost}
          label="Стоимость"
          placeholder="-"
          mask={maskOnlyDigitsWithSeparator}
          disabled
        />
      </Box>

      {!isError && (
        <Box className={classes.btnContainer} gridColumn="span 1">
          {isLastItem && <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />}
          <CloseSquareBtn onClick={removeItem} disabled={isRequired} />
        </Box>
      )}
    </Box>
  )
}
