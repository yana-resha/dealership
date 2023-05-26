import React from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { RequisitesDealerServices } from 'entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import { DealerServicesRequisites } from 'entities/application/DossierAreas/ui'

import { FormFieldNameMap } from '../../../../../types'
import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: {
    productType: { value: string | number; label: string }[]
    loanTerms: { value: string | number }[]
  }
  name: string
  requisites: RequisitesDealerServices[]
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
}

export function AdditionalServices({
  title,
  options,
  name,
  requisites,
  isError = false,
  errorMessage,
  disabled = false,
}: Props) {
  const classes = useStyles()
  const [field] = useField(name)

  const { ids, changeIds } = useAdditionalServiceIds()

  return (
    <AdditionalServicesContainer
      title={title}
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
    >
      <FieldArray name={name}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, index: number, arr: any[]) => (
              <React.Fragment key={ids[index]}>
                <DealerServicesRequisites
                  requisites={name === FormFieldNameMap.dealerAdditionalServices ? requisites : []}
                  index={index}
                  parentName={name}
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
