import { forwardRef, useMemo } from 'react'

import { Box } from '@mui/material'
import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import {
  BankAdditionalOption,
  useGetVendorOptionsQuery,
} from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useRateMod } from 'common/OrderCalculator/hooks/useRateMod'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { CommonOrderSettings } from 'common/OrderCalculator/ui/CommonOrderSettings/CommonOrderSettings'
import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { FraudDialog } from 'entities/SpecialMark'
import { checkIsNumber } from 'shared/lib/helpers'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useCreditProductsData } from '../../../../../hooks/useCreditProductsData'
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
    creditProductListData,
    minInitialPaymentPercent,
    maxInitialPaymentPercent,
    minInitialPayment,
    maxInitialPayment,
    currentProduct,
    currentDurationMin,
    currentDurationMax,
    durationMaxFromAge,
    isGetCarsLoading,
    isGetCarsSuccess,
    clientAge,
    isLoading: isLimitsLoading,
    isSuccess: isLimitsSuccess,
  } = useCreditProductsData()

  const { loanTerms } = useCreditProductsTerms({
    currentDurationMin,
    currentDurationMax,
    currentProduct,
    durationMaxFromAge,
  })

  const { commonErrors, isNecessaryCasco } = useCreditProductsValidations({
    minInitialPaymentPercent,
    maxInitialPaymentPercent,
    minInitialPayment,
    maxInitialPayment,
  })

  const { currentRateMod, isShouldShowDiscountNotification, maxRateModsMap } = useRateMod({
    creditProductListData,
    currentProduct,
    additionalOptionsMap: vendorOptions?.additionalOptionsMap,
    isVendorOptionsSuccess,
    initialBankAdditionalService: INITIAL_BANK_ADDITIONAL_SERVICE,
  })

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
          <CommonOrderSettings
            disabled={disabled}
            minInitialPaymentPercent={minInitialPaymentPercent}
            maxInitialPaymentPercent={maxInitialPaymentPercent}
            minInitialPayment={minInitialPayment}
            maxInitialPayment={maxInitialPayment}
            currentProduct={currentProduct}
            loanTerms={loanTerms}
            durationMaxFromAge={durationMaxFromAge}
            currentDurationMin={currentDurationMin}
            currentDurationMax={currentDurationMax}
            isGetCarsLoading={isGetCarsLoading}
            isGetCarsSuccess={isGetCarsSuccess}
          />

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
            currentRateMod={currentRateMod}
            isShouldShowInfoIcon={isShouldShowDiscountNotification}
            maxRateModsMap={maxRateModsMap}
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
