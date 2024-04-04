import { useMemo } from 'react'

import { Box } from '@mui/material'
import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useLimits } from 'common/OrderCalculator/hooks/useLimits'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { AdditionalEquipment } from './AdditionalEquipment/AdditionalEquipment'
import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import { CommonOrderSettings } from './CommonOrderSettings/CommonOrderSettings'
import useStyles from './OrderSettingsArea.styles'

type Props = {
  disabled: boolean
  isSubmitLoading: boolean
  disabledSubmit: boolean
}

export function OrderSettingsArea({ disabled, isSubmitLoading, disabledSubmit }: Props) {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()
  const {
    data: vendorOptions,
    isLoading: isVendorOptionsLoading,
    isSuccess: isVendorOptionsSuccess,
  } = useGetVendorOptionsQuery({
    vendorCode,
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
    isLoadedCreditProducts,
    isLoading: isLimitsLoading,
    isSuccess: isLimitsSuccess,
  } = useLimits(vendorCode)

  const isSectionLoading = isLimitsLoading || isVendorOptionsLoading
  const isSectionLoaded = !isSectionLoading && isLimitsSuccess && isVendorOptionsSuccess
  const isSectionError = !isSectionLoaded && !(isLimitsSuccess && isVendorOptionsSuccess)
  const isSubmitBtnLoading = isSubmitLoading || isSectionLoading
  const isSubmitBtnDisabled = disabledSubmit || isSectionError

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
        <Box className={classes.gridWrapper} data-testid="fullOrderSettingsArea">
          <CommonOrderSettings
            disabled={disabled}
            creditProducts={creditProducts}
            initialPaymentPercentHelperText={initialPaymentPercentHelperText}
            initialPaymentHelperText={initialPaymentHelperText}
            loanTerms={loanTerms}
          />

          <AdditionalEquipment options={{ productType: additionalEquipments, loanTerms }} />
          <AdditionalServices
            title="Дополнительные услуги дилера"
            options={{ productType: dealerAdditionalServices, loanTerms }}
            name={ServicesGroupName.dealerAdditionalServices}
            isNecessaryCasco={isNecessaryCasco}
            isLoadedCreditProducts={isLoadedCreditProducts}
          />
          <AdditionalServices
            title="Дополнительные услуги банка"
            options={{ productType: [], loanTerms }}
            name={ServicesGroupName.bankAdditionalServices}
            disabled
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
}
