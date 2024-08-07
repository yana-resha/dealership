import { useEffect } from 'react'

import { Box } from '@mui/material'
import { CalcType } from '@sberauto/dictionarydc-proto/public'
import { ArrayHelpers, useFormikContext } from 'formik'

import { INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { MONTH_OF_YEAR_COUNT } from 'common/OrderCalculator/constants'
import { BankAdditionalOption } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import {
  FormFieldNameMap,
  BriefOrderCalculatorFields,
  OrderCalculatorBankAdditionalService,
  MaxRateModsMap,
} from 'common/OrderCalculator/types'
import { RequiredRateMod } from 'entities/order/model/orderSlice'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { CustomTooltip } from 'shared/ui/CustomTooltip'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { ServicesGroupName } from '../../configs/additionalOptionsRequisites.config'
import { useAdditionalServices } from '../../hooks/useAdditionalServices'
import useStyles from './BankAdditionalService.styles'
import { useAdditionalBankServicesOptions } from './useAdditionalBankServicesOptions'

const getProductCost = (
  calcType: CalcType.FIX | CalcType.LOAN_AMOUNT,
  price: number,
  loanTerm: number,
  carCredit: number,
) => {
  switch (calcType) {
    case CalcType.FIX:
      return Math.ceil((price * loanTerm) / MONTH_OF_YEAR_COUNT)
    case CalcType.LOAN_AMOUNT:
      return Math.ceil((carCredit * price * loanTerm) / MONTH_OF_YEAR_COUNT)
  }
}

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
  currentRateMod: RequiredRateMod | undefined
  maxRateModsMap: MaxRateModsMap
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
  currentRateMod,
  maxRateModsMap,
}: Props) {
  const classes = useStyles()

  const { values, setFieldValue, setFieldTouched } = useFormikContext<BriefOrderCalculatorFields>()
  const { carCost, initialPayment } = values
  const { productType, tariff: currentTariffId, loanTerm } = servicesItem

  const { namePrefix, isLastItem, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
    initialValues: INITIAL_BANK_ADDITIONAL_SERVICE,
  })

  const {
    shouldDisableAdding,
    filteredOptionsWithSubLabels,
    tariffOptions,
    currentTariff,
    loanTermOptions,
    isRequired,
  } = useAdditionalBankServicesOptions({
    options,
    additionalServices,
    parentName,
    index,
    servicesItem,
    clientAge,
    currentRateMod,
    maxRateModsMap,
  })

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
    if (currentTariff?.price && loanTerm !== null && currentTariff?.calcType) {
      const carCostNumber = stringToNumber(carCost) ?? 0
      const carCredit = carCostNumber ? carCostNumber - (stringToNumber(initialPayment) ?? 0) : 0
      const productCost = getProductCost(currentTariff.calcType, currentTariff?.price, loanTerm, carCredit)

      setFieldValue(namePrefix + FormFieldNameMap.productCost, `${productCost}`)
    } else {
      setFieldValue(namePrefix + FormFieldNameMap.productCost, INITIAL_BANK_ADDITIONAL_SERVICE.productCost)
    }
  }, [
    carCost,
    currentTariff?.calcType,
    currentTariff?.price,
    initialPayment,
    loanTerm,
    namePrefix,
    setFieldValue,
  ])

  return (
    <Box className={classes.gridContainer}>
      <SelectInputFormik
        name={namePrefix + FormFieldNameMap.productType}
        label={productLabel}
        placeholder="-"
        options={filteredOptionsWithSubLabels}
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
