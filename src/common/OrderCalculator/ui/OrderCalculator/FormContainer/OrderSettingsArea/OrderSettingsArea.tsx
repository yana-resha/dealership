import { useMemo } from 'react'

import { Box } from '@mui/material'
import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useInitialPayment } from 'common/OrderCalculator/hooks/useInitialPayment'
import { useLimits } from 'common/OrderCalculator/hooks/useLimits'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { FraudDialog } from 'entities/SpecialMark'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import useStyles from './OrderSettingsArea.styles'

type Props = {
  disabled: boolean
  isSubmitLoading: boolean
}

export function OrderSettingsArea({ disabled, isSubmitLoading }: Props) {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()

  const { data: vendorOptions, isError: vendorOptionsIsError } = useGetVendorOptionsQuery({
    vendorCode: vendorCode,
  })

  const additionalEquipments = useMemo(
    () =>
      vendorOptions?.additionalOptions
        ?.filter(option => option.optionType === OptionType.EQUIPMENT)
        .map(option => ({
          value: option.optionId,
          label: option.optionName,
        })) || [],
    [vendorOptions?.additionalOptions],
  )
  const dealerAdditionalServices = useMemo(
    () =>
      vendorOptions?.additionalOptions
        ?.filter(option => option.optionType === OptionType.DEALER)
        .map(option => ({
          value: option.optionId,
          label: option.optionName,
        })) || [],
    [vendorOptions?.additionalOptions],
  )

  const {
    creditProducts,
    initialPaymentHelperText,
    initialPaymentPercentHelperText,
    loanTerms,
    commonErrors,
    isNecessaryCasco,
  } = useLimits({ vendorCode })

  const {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  } = useInitialPayment(disabled)

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
            helperMessage={initialPaymentHelperText}
            InputProps={{ onFocus: handleInitialPaymentFocus, onBlur: handleInitialPaymentBlur }}
          />
          <MaskedInputFormik
            name={FormFieldNameMap.initialPaymentPercent}
            label="Первоначальный взнос в %"
            placeholder="-"
            mask={maskPercent}
            gridColumn="span 1"
            helperMessage={initialPaymentPercentHelperText}
            InputProps={{
              onFocus: handleInitialPaymentPercentFocus,
              onBlur: handleInitialPaymentPercentBlur,
            }}
          />
          <SelectInputFormik
            name={FormFieldNameMap.loanTerm}
            label="Срок"
            placeholder="-"
            options={loanTerms}
            gridColumn="span 1"
          />
        </Box>

        <AdditionalServices
          title="Дополнительное оборудование"
          options={additionalEquipments}
          name={ServicesGroupName.additionalEquipments}
          productLabel="Вид оборудования"
          isError={vendorOptionsIsError}
          errorMessage="Произошла ошибка при получении дополнительных услуг дилера. Перезагрузите страницу"
        />
        <AdditionalServices
          title="Дополнительные услуги дилера"
          options={dealerAdditionalServices}
          name={ServicesGroupName.dealerAdditionalServices}
          isNecessaryCasco={isNecessaryCasco}
          productLabel="Тип продукта"
          isError={vendorOptionsIsError}
          errorMessage="Произошла ошибка при получении дополнительных услуг дилера. Перезагрузите страницу"
        />
        <AdditionalServices
          disabled
          title="Дополнительные услуги банка"
          options={[]}
          name={ServicesGroupName.bankAdditionalServices}
          productLabel="Тип продукта"
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
