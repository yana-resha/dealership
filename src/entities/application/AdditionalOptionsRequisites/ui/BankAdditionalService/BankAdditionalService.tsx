import { useCallback, useEffect, useMemo } from 'react'

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
import { CustomTooltip } from 'shared/ui/CustomTooltip'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { stringToNumber } from 'shared/utils/stringToNumber'

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

  const { values, setFieldValue, setFieldTouched } = useFormikContext<BriefOrderCalculatorFields>()
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
    const maxLoanTermByClientAge = (currentTariff.maxClientAge - clientAge) * MONTH_OF_YEAR_COUNT
    const maxLoanTermByLoanTerm = values.loanTerm || maxLoanTermByClientAge
    const maxLoanTerm = Math.min(maxLoanTermByClientAge, maxLoanTermByLoanTerm, currentTariff.maxTerm)

    if (currentTariff.minTerm > maxLoanTerm || maxLoanTerm <= 0) {
      return []
    }
    const scaleLength = Math.floor((maxLoanTerm - currentTariff.minTerm) / LOAN_TERM_GRADUATION_VALUE + 1)
    const loanTerms = [...new Array(scaleLength)].map((v, i) => ({
      value: (i + 1) * LOAN_TERM_GRADUATION_VALUE + currentTariff.minTerm - LOAN_TERM_GRADUATION_VALUE,
    }))

    return loanTerms
  }, [clientAge, currentTariff, values.loanTerm])

  const isRequired = !!selectedRequiredOptionsMap[productType ?? '']

  useEffect(() => {
    if (currentTariffId && !tariffOptions.some(option => option.value === currentTariffId)) {
      setFieldValue(namePrefix + FormFieldNameMap.tariff, INITIAL_BANK_ADDITIONAL_SERVICE.tariff)
    }
  }, [currentTariffId, namePrefix, setFieldValue, tariffOptions])

  useEffect(() => {
    if (loanTerm && !loanTermOptions.some(option => option.value === loanTerm)) {
      setFieldValue(namePrefix + FormFieldNameMap.loanTerm, INITIAL_BANK_ADDITIONAL_SERVICE.loanTerm)
      setFieldTouched(namePrefix + FormFieldNameMap.loanTerm, true, true)
    }
  }, [loanTerm, loanTermOptions, namePrefix, setFieldTouched, setFieldValue])

  useEffect(() => {
    const price = stringToNumber(currentTariff?.price)
    if (price && loanTerm !== null) {
      setFieldValue(namePrefix + FormFieldNameMap.productCost, `${(price * loanTerm) / MONTH_OF_YEAR_COUNT}`)
    } else {
      setFieldValue(namePrefix + FormFieldNameMap.productCost, INITIAL_BANK_ADDITIONAL_SERVICE.productCost)
    }
  }, [currentTariff?.price, loanTerm, namePrefix, setFieldValue])

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
        gridColumn="span 2"
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

      {/* всегда в кредит */}
      <Box className={classes.switchContainer} gridColumn="span 1">
        <CustomTooltip arrow title={<span>Услуги банка всегда оформляются в кредит</span>}>
          <Box>
            <SwitchInput label="В кредит" value={true} disabled />
          </Box>
        </CustomTooltip>
      </Box>

      {!isError && (
        <Box className={classes.btnContainer} gridColumn="span 1">
          {isLastItem && <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />}
          <CustomTooltip
            arrow
            title={
              <span>
                Выбран кредитный продукт с обязательной услугой, для отказа от услуги - выберите другой
                кредитный продукт
              </span>
            }
            disableHoverListener={!isRequired}
          >
            <Box>
              <CloseSquareBtn onClick={removeItem} disabled={isRequired} />
            </Box>
          </CustomTooltip>
        </Box>
      )}
    </Box>
  )
}
