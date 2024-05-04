import React from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { FULL_INITIAL_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { DealerServicesRequisites } from 'entities/application/AdditionalOptionsRequisites/ui'
import { checkIsNumber } from 'shared/lib/helpers'

import useStyles from './AdditionalServices.styles'

type Props = {
  options: {
    productType: { value: number; label: string }[]
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
  const isInitialExpanded = !!field.value.length && checkIsNumber(field.value[0].productType)

  return (
    <AdditionalServicesContainer
      title="Дополнительные услуги дилера"
      name={ServicesGroupName.dealerAdditionalServices}
      initialValues={FULL_INITIAL_ADDITIONAL_SERVICE}
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
                  productOptions={options.productType}
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
