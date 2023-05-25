import { useMemo } from 'react'

import { Box } from '@mui/material'

import {
  ADDITIONAL_EQUIPMENTS,
  AreaFooter,
  FormFieldNameMap,
  useInitialPayment,
} from 'entities/OrderCalculator'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetVendorOptions } from 'shared/api/dictionaryDc/dictionaryDc.api'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import { FraudDialog } from './FraudDialog/FraudDialog'
import useStyles from './OrderSettingsArea.styles'
import { useLimits } from './useLimits'

type Props = {
  disabled: boolean
  isSubmitLoading: boolean
}

export function OrderSettingsArea({ disabled, isSubmitLoading }: Props) {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()
  const additionalEquipmentIsError = false
  const bankOptionsIsError = false

  const { data: vendorOptions, isError: vendorOptionsIsError } = useGetVendorOptions({
    vendorCode: vendorCode,
  })

  const additionalEquipments = useMemo(() => ADDITIONAL_EQUIPMENTS.map(option => option.optionName), [])
  const dealerAdditionalServices = useMemo(
    () => vendorOptions?.options?.map(option => option.optionName || '') || [],
    [vendorOptions?.options],
  )

  const {
    creditProducts,
    initialPaymentPercentHalperText,
    initialPaymentHalperText,
    loanTerm,
    commonErrors,
  } = useLimits({
    vendorCode,
  })

  const {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  } = useInitialPayment(
    FormFieldNameMap.carCost,
    FormFieldNameMap.initialPayment,
    FormFieldNameMap.initialPaymentPercent,
    disabled,
  )

  return (
    <CollapsibleFormAreaContainer
      title="Параметры кредита"
      disabled={disabled}
      shouldExpanded={disabled ? false : undefined}
    >
      <Box className={classes.gridWrapper}>
        <Box className={classes.gridContainer}>
          <SelectInputFormik
            name={FormFieldNameMap.creditProduct}
            label="Кредитный продукт"
            placeholder="-"
            options={creditProducts}
            gridColumn="span 2"
            emptyAvailable
          />
          <MaskedInputFormik
            name={FormFieldNameMap.initialPayment}
            label="Первоначальный взнос"
            placeholder="-"
            mask={maskOnlyDigitsWithSeparator}
            gridColumn="span 1"
            helperMessage={initialPaymentHalperText}
            InputProps={{ onFocus: handleInitialPaymentFocus, onBlur: handleInitialPaymentBlur }}
          />
          <MaskedInputFormik
            name={FormFieldNameMap.initialPaymentPercent}
            label="Первоначальный взнос в %"
            placeholder="-"
            mask={maskPercent}
            gridColumn="span 1"
            helperMessage={initialPaymentPercentHalperText}
            InputProps={{
              onFocus: handleInitialPaymentPercentFocus,
              onBlur: handleInitialPaymentPercentBlur,
            }}
          />
          <SelectInputFormik
            name={FormFieldNameMap.loanTerm}
            label="Срок"
            placeholder="-"
            options={loanTerm}
            gridColumn="span 1"
            helperMessage="от 0 до 1 800 000"
          />
        </Box>

        <AdditionalServices
          title="Дополнительное оборудование"
          options={additionalEquipments}
          name={FormFieldNameMap.additionalEquipments}
          productLabel="Вид оборудования"
          isError={additionalEquipmentIsError}
        />
        <AdditionalServices
          title="Дополнительные услуги дилера"
          options={dealerAdditionalServices}
          name={FormFieldNameMap.dealerAdditionalServices}
          productLabel="Тип продукта"
          isError={vendorOptionsIsError}
          errorMessage="Произошла ошибка при получении дополнительных услуг дилера. Перезагрузите страницу"
        />
        <AdditionalServices
          disabled
          title="Дополнительные услуги банка"
          options={[]}
          name={FormFieldNameMap.bankAdditionalServices}
          productLabel="Тип продукта"
          isError={bankOptionsIsError}
        />
        {!!commonErrors.length && (
          <Box className={classes.errorList}>
            {commonErrors.map(e => (
              <SberTypography sberautoVariant="body3" component="p" key={e}>
                {e}
              </SberTypography>
            ))}
          </Box>
        )}
        <AreaFooter btnTitle="Рассчитать" btnType="submit" isLoadingBtn={isSubmitLoading}>
          <FraudDialog />
        </AreaFooter>
      </Box>
    </CollapsibleFormAreaContainer>
  )
}
