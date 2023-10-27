import React from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { DealerServicesRequisites } from 'entities/application/AdditionalOptionsRequisites/ui'

import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: {
    productType: { value: string | number; label: string }[]
    loanTerms: { value: string | number }[]
  }
  name: ServicesGroupName
  isNecessaryCasco?: boolean
  isLoadedCreditProducts?: boolean
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
}

export function AdditionalServices({
  title,
  options,
  name,
  isNecessaryCasco = false,
  isLoadedCreditProducts = false,
  isError = false,
  errorMessage,
  disabled = false,
}: Props) {
  const classes = useStyles()
  const [field] = useField(name)

  const { ids, changeIds } = useAdditionalServiceIds()
  const isInitialExpanded = !!field.value.length && !!field.value[0].productType

  return (
    <AdditionalServicesContainer
      title={title}
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
      isInitialExpanded={isInitialExpanded}
    >
      <FieldArray name={name}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, index: number, arr: any[]) => (
              <React.Fragment key={ids[index]}>
                <DealerServicesRequisites
                  index={index}
                  parentName={name}
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
