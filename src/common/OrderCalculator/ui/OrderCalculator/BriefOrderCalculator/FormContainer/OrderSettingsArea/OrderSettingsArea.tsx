import { forwardRef, useMemo } from 'react'

import { Box } from '@mui/material'
import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import {
  BankAdditionalOption,
  useGetVendorOptionsQuery,
} from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useInitialPayment } from 'common/OrderCalculator/hooks/useInitialPayment'
import { useRequiredService } from 'common/OrderCalculator/hooks/useRequiredService'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { FraudDialog } from 'entities/SpecialMark'
import { checkIsNumber } from 'shared/lib/helpers'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { useCreditProductsData } from '../../../../../hooks/useCreditProductsData'
import { useCreditProductsLimits } from '../../../../../hooks/useCreditProductsLimits'
import { useCreditProductsTerms } from '../../../../../hooks/useCreditProductsTerms'
import { useCreditProductsValidations } from '../../../../../hooks/useCreditProductsValidations'
import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import useStyles from './OrderSettingsArea.styles'

type Props = {
  disabled: boolean
  isSubmitLoading: boolean
  isDisabledSubmit: boolean
}

export const OrderSettingsArea = forwardRef(({ disabled, isSubmitLoading, isDisabledSubmit }: Props, ref) => {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()

  const {
    data: vendorOptions,
    isLoading: isVendorOptionsLoading,
    isSuccess: isVendorOptionsSuccess,
  } = useGetVendorOptionsQuery({
    vendorCode,
  })

  const {
    initialPaymentData,
    creditProductsData,
    creditDurationData,
    durationMaxFromAge,
    isGetCarsLoading,
    isGetCarsSuccess,
    clientAge,
    isLoading: isLimitsLoading,
    isSuccess: isLimitsSuccess,
  } = useCreditProductsData(vendorCode)
  const { creditProducts, initialPaymentHelperText, initialPaymentPercentHelperText } =
    useCreditProductsLimits(
      initialPaymentData,
      creditProductsData,
      durationMaxFromAge,
      isGetCarsLoading,
      isGetCarsSuccess,
    )
  const { loanTerms } = useCreditProductsTerms(creditDurationData, creditProductsData, durationMaxFromAge)
  const { commonErrors, isNecessaryCasco } = useCreditProductsValidations(initialPaymentData)

  const { selectedRequiredOptionsMap } = useRequiredService({
    creditProductsData,
    additionalOptionsMap: vendorOptions?.additionalOptionsMap,
    isVendorOptionsSuccess,
    initialBankAdditionalService: INITIAL_BANK_ADDITIONAL_SERVICE,
  })

  const {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  } = useInitialPayment(disabled)

  const additionalEquipments = useMemo(
    () =>
      vendorOptions?.additionalOptions?.filter(option => option.optionType === OptionType.EQUIPMENT) || [],
    [vendorOptions?.additionalOptions],
  )
  const dealerAdditionalServices = useMemo(
    () => vendorOptions?.additionalOptions?.filter(option => option.optionType === OptionType.DEALER) || [],
    [vendorOptions?.additionalOptions],
  )

  const bankAdditionalServices = useMemo(
    () =>
      (vendorOptions?.additionalOptions?.filter(option => {
        const isBankOption = option.optionType === OptionType.BANK

        // Если clientAge отсутствует, то банковские опции недоступны
        if (!checkIsNumber(clientAge)) {
          return false
        }

        const isValidClientAge = option.tariffs?.some(tariff => {
          const { minClientAge, maxClientAge } = tariff
          if (!checkIsNumber(minClientAge) || !checkIsNumber(maxClientAge)) {
            return false
          }

          return (
            (clientAge as number) >= (minClientAge as number) &&
            (clientAge as number) <= (maxClientAge as number)
          )
        })

        return isBankOption && isValidClientAge
      }) as BankAdditionalOption[]) || [],
    [clientAge, vendorOptions?.additionalOptions],
  )

  const isSectionLoading = isLimitsLoading || isVendorOptionsLoading
  const isSectionLoaded = !isSectionLoading && isLimitsSuccess && isVendorOptionsSuccess
  const isSectionError = !isSectionLoading && (!isLimitsSuccess || !isVendorOptionsSuccess)
  const isSubmitBtnLoading = isSubmitLoading || isSectionLoading
  const isSubmitBtnDisabled = isDisabledSubmit || isSectionError

  return (
    <CollapsibleFormAreaContainer
      title="Параметры кредита"
      disabled={disabled}
      shouldExpanded={disabled ? false : undefined}
    >
      {isSectionLoading && (
        <Box className={classes.loaderContainer}>
          <CircularProgressWheel size="large" />
        </Box>
      )}

      {isSectionLoaded && (
        <Box className={classes.gridWrapper} ref={ref}>
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
            additionalServices={additionalEquipments}
            name={ServicesGroupName.additionalEquipments}
            productLabel="Вид оборудования"
          />
          <AdditionalServices
            title="Дополнительные услуги дилера"
            additionalServices={dealerAdditionalServices}
            name={ServicesGroupName.dealerAdditionalServices}
            productLabel="Тип продукта"
            isNecessaryCasco={isNecessaryCasco}
          />
          <AdditionalServices
            title="Дополнительные услуги банка"
            additionalServices={bankAdditionalServices}
            name={ServicesGroupName.bankAdditionalServices}
            productLabel="Тип продукта"
            clientAge={clientAge}
            selectedRequiredOptionsMap={selectedRequiredOptionsMap}
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

          <AreaFooter
            btnTitle="Рассчитать"
            btnType="submit"
            isLoadingBtn={isSubmitBtnLoading}
            disabled={isSubmitBtnDisabled}
          >
            <FraudDialog />
          </AreaFooter>
        </Box>
      )}

      {isSectionError && (
        <Box className={classes.errorList}>
          <SberTypography sberautoVariant="body3" component="p">
            {DEFAULT_DATA_LOADING_ERROR_MESSAGE}
          </SberTypography>
        </Box>
      )}
    </CollapsibleFormAreaContainer>
  )
})
