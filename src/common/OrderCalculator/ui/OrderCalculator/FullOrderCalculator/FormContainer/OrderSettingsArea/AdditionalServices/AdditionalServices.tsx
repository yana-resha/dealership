import React, { useMemo } from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { FULL_INITIAL_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { useAdditionalServicesGroupe } from 'common/OrderCalculator/hooks/useAdditionalServicesGroupe'
import { NonNullableAdditionalOption } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { DealerServicesRequisites } from 'entities/applications/AdditionalOptionsRequisites/ui'

import useStyles from './AdditionalServices.styles'

type Props = {
  options: {
    productType: NonNullableAdditionalOption[]
    loanTerms: { value: number }[]
  }
  isNecessaryCasco?: boolean
  isLoadedCreditProducts?: boolean
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
}

export function AdditionalServices({
  options,
  isNecessaryCasco = false,
  isLoadedCreditProducts = false,
  isError = false,
  errorMessage,
  disabled = false,
}: Props) {
  const classes = useStyles()
  const [field] = useField(ServicesGroupName.dealerAdditionalServices)

  const { ids, changeIds } = useAdditionalServiceIds()
  const { isInitialExpanded, isShouldExpanded, resetShouldExpanded } = useAdditionalServicesGroupe(
    ServicesGroupName.dealerAdditionalServices,
    FULL_INITIAL_ADDITIONAL_SERVICE,
  )

  const productOptions = useMemo(
    () =>
      options.productType.map(option => ({
        value: option.optionId,
        label: option.optionName,
      })) || [],
    [options.productType],
  )

  return (
    <AdditionalServicesContainer
      title="Дополнительные услуги дилера"
      name={ServicesGroupName.dealerAdditionalServices}
      initialValues={FULL_INITIAL_ADDITIONAL_SERVICE}
      isShouldExpanded={isShouldExpanded}
      resetShouldExpanded={resetShouldExpanded}
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
      isInitialExpanded={isInitialExpanded}
    >
      <FieldArray name={ServicesGroupName.dealerAdditionalServices}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, index: number, arr: any[]) => (
              <React.Fragment key={ids[index]}>
                <DealerServicesRequisites
                  index={index}
                  parentName={ServicesGroupName.dealerAdditionalServices}
                  isNecessaryCasco={isNecessaryCasco}
                  isLoadedCreditProducts={isLoadedCreditProducts}
                  isRequisiteEditable={true}
                  productOptions={productOptions}
                  arrayHelpers={arrayHelpers}
                  arrayLength={arr.length}
                  servicesItem={v}
                  changeIds={changeIds}
                />
                {index < arr.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        )}
      </FieldArray>
    </AdditionalServicesContainer>
  )
}
