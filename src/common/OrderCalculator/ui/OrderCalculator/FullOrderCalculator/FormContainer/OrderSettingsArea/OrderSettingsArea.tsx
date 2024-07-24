import { forwardRef, useMemo } from 'react'

import { Box } from '@mui/material'
import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { FULL_INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import {
  BankAdditionalOption,
  useGetVendorOptionsQuery,
} from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useRequiredService } from 'common/OrderCalculator/hooks/useRequiredService'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { checkIsNumber } from 'shared/lib/helpers'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useCreditProductsData } from '../../../../../hooks/useCreditProductsData'
import { useCreditProductsLimits } from '../../../../../hooks/useCreditProductsLimits'
import { useCreditProductsTerms } from '../../../../../hooks/useCreditProductsTerms'
import { useCreditProductsValidations } from '../../../../../hooks/useCreditProductsValidations'
import { AdditionalBankService } from './AdditionalBankService/AdditionalBankService'
import { AdditionalEquipment } from './AdditionalEquipment/AdditionalEquipment'
import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import { CommonOrderSettings } from './CommonOrderSettings/CommonOrderSettings'
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
  } = useGetVendorOptionsQuery({ vendorCode })

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
    isLoadedCreditProducts,
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
    initialBankAdditionalService: FULL_INITIAL_BANK_ADDITIONAL_SERVICE,
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
        <Box className={classes.gridWrapper} ref={ref} data-testid="fullOrderSettingsArea">
          <CommonOrderSettings
            disabled={disabled}
            creditProducts={creditProducts}
            initialPaymentPercentHelperText={initialPaymentPercentHelperText}
            initialPaymentHelperText={initialPaymentHelperText}
            loanTerms={loanTerms}
          />

          <AdditionalEquipment options={{ productType: additionalEquipments, loanTerms }} />
          <AdditionalServices
            options={{ productType: dealerAdditionalServices, loanTerms }}
            isNecessaryCasco={isNecessaryCasco}
            isLoadedCreditProducts={isLoadedCreditProducts}
          />
          <AdditionalBankService
            additionalServices={bankAdditionalServices}
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
          />
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
