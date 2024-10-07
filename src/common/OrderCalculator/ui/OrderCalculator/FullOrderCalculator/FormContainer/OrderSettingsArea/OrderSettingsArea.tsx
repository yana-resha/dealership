import { forwardRef } from 'react'

import { Box } from '@mui/material'

import {
  FULL_INITIAL_ADDITIONAL_EQUIPMENTS,
  FULL_INITIAL_ADDITIONAL_SERVICE,
  FULL_INITIAL_BANK_ADDITIONAL_SERVICE,
  INITIAL_BANK_ADDITIONAL_SERVICE,
} from 'common/OrderCalculator/config'
import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import { useAdditionalServices } from 'common/OrderCalculator/hooks/useAdditionalServices'
import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useRateMod } from 'common/OrderCalculator/hooks/useRateMod'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { CommonOrderSettings } from 'common/OrderCalculator/ui/CommonOrderSettings/CommonOrderSettings'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useCreditProductsData } from '../../../../../hooks/useCreditProductsData'
import { useCreditProductsTerms } from '../../../../../hooks/useCreditProductsTerms'
import { useCreditProductsValidations } from '../../../../../hooks/useCreditProductsValidations'
import { AdditionalBankService } from './AdditionalBankService/AdditionalBankService'
import { AdditionalEquipment } from './AdditionalEquipment/AdditionalEquipment'
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
  } = useGetVendorOptionsQuery({ vendorCode })

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
    isLoadedCreditProducts,
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
    initialBankAdditionalService: FULL_INITIAL_BANK_ADDITIONAL_SERVICE,
  })

  const {
    isShowAdditionalServices,
    bankAdditionalServiceOptions,
    dealerAdditionalServiceOptions,
    additionalEquipmentOptions,
  } = useAdditionalServices({
    isLoadedCreditProducts,
    vendorOptions,
    clientAge,
    currentRateMod,
    initialDealerAdditionalService: FULL_INITIAL_ADDITIONAL_SERVICE,
    initialAdditionalEquipment: FULL_INITIAL_ADDITIONAL_EQUIPMENTS,
    initialBankAdditionalService: INITIAL_BANK_ADDITIONAL_SERVICE,
  })

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

          {isShowAdditionalServices && (
            <>
              <AdditionalEquipment options={{ productType: additionalEquipmentOptions, loanTerms }} />
              <AdditionalServices
                options={{ productType: dealerAdditionalServiceOptions, loanTerms }}
                isNecessaryCasco={isNecessaryCasco}
                isLoadedCreditProducts={isLoadedCreditProducts}
              />
              <AdditionalBankService
                additionalServices={bankAdditionalServiceOptions}
                clientAge={clientAge}
                currentRateMod={currentRateMod}
                isShouldShowInfoIcon={isShouldShowDiscountNotification}
                maxRateModsMap={maxRateModsMap}
              />
            </>
          )}

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
