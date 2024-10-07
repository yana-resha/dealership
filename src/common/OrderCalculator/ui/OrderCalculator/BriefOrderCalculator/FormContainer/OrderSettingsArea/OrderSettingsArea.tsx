import { forwardRef } from 'react'

import { Box } from '@mui/material'

import { INITIAL_ADDITIONAL_SERVICE, INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import { useAdditionalServices } from 'common/OrderCalculator/hooks/useAdditionalServices'
import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useRateMod } from 'common/OrderCalculator/hooks/useRateMod'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { CommonOrderSettings } from 'common/OrderCalculator/ui/CommonOrderSettings/CommonOrderSettings'
import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { FraudDialog } from 'entities/SpecialMark'
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
    isLoadedCreditProducts,
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

  const {
    isShowAdditionalServices,
    additionalEquipmentOptions,
    dealerAdditionalServiceOptions,
    bankAdditionalServiceOptions,
  } = useAdditionalServices({
    vendorOptions,
    clientAge,
    currentRateMod,
    isLoadedCreditProducts,
    initialDealerAdditionalService: INITIAL_ADDITIONAL_SERVICE,
    initialAdditionalEquipment: INITIAL_ADDITIONAL_SERVICE,
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

          {isShowAdditionalServices && (
            <>
              <AdditionalServices
                title="Дополнительное оборудование"
                additionalServices={additionalEquipmentOptions}
                name={ServicesGroupName.additionalEquipments}
                productLabel="Тип доп оборудования"
              />
              <AdditionalServices
                title="Дополнительные услуги дилера"
                additionalServices={dealerAdditionalServiceOptions}
                name={ServicesGroupName.dealerAdditionalServices}
                productLabel="Тип продукта"
                isNecessaryCasco={isNecessaryCasco}
              />
              <AdditionalServices
                title="Дополнительные услуги банка"
                additionalServices={bankAdditionalServiceOptions}
                name={ServicesGroupName.bankAdditionalServices}
                productLabel="Тип продукта"
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
