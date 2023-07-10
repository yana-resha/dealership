import React from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { RequisitesDealerServices } from 'entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { DealerServicesRequisites } from 'entities/application/DossierAreas/ui'

import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: {
    productType: { value: string | number; label: string }[]
    loanTerms: { value: string | number }[]
  }
  name: ServicesGroupName
  isNecessaryCasco?: boolean
  requisites: RequisitesDealerServices[]
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
}

export function AdditionalServices({
  title,
  options,
  name,
  isNecessaryCasco = false,
  requisites,
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
                  requisites={name === ServicesGroupName.dealerAdditionalServices ? requisites : []}
                  index={index}
                  parentName={name}
                  isNecessaryCasco={isNecessaryCasco}
                  isRequisiteEditable={true}
                  productOptions={options.productType}
                  arrayHelpers={arrayHelpers}
                  arrayLength={arr.length}
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
