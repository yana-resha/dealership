import { useMemo } from 'react'

import { Box } from '@mui/material'
import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useInitialPayment } from 'common/OrderCalculator/hooks/useInitialPayment'
import { useLimits } from 'common/OrderCalculator/hooks/useLimits'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { FraudDialog } from 'entities/SpecialMark'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { AdditionalServices } from './AdditionalServices/AdditionalServices'
import useStyles from './OrderSettingsArea.styles'

type Props = {
  disabled: boolean
  isSubmitLoading: boolean
  isDisabledSubmit: boolean
}

export function OrderSettingsArea({ disabled, isSubmitLoading, isDisabledSubmit }: Props) {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()

  const {
    data: vendorOptions,
    isLoading: isVendorOptionsLoading,
    isSuccess: isVendorOptionsSuccess,
  } = useGetVendorOptionsQuery({
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
    isLoading: isLimitsLoading,
    isSuccess: isLimitsSuccess,
  } = useLimits({ vendorCode })

  const {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  } = useInitialPayment(disabled)

  const isSectionLoading = isLimitsLoading || isVendorOptionsLoading
  const isSectionLoaded = !isSectionLoading && isLimitsSuccess && isVendorOptionsSuccess
  const isSectionError = !isSectionLoaded && !(isLimitsSuccess && isVendorOptionsSuccess)
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
          />
          <AdditionalServices
            title="Дополнительные услуги дилера"
            options={dealerAdditionalServices}
            name={ServicesGroupName.dealerAdditionalServices}
            isNecessaryCasco={isNecessaryCasco}
            productLabel="Тип продукта"
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
}
