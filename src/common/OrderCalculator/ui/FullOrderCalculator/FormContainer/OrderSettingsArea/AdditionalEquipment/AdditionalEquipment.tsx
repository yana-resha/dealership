import React from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { RequisitesAdditionalOptions } from 'entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { AdditionalEquipmentRequisites } from 'entities/application/DossierAreas/ui'

import useStyles from './AdditionalEquipment.styles'

type Props = {
  requisites: RequisitesAdditionalOptions[]
  disabled?: boolean
  isError?: boolean
  errorMessage?: string
  options: {
    productType: { value: string | number; label: string }[]
    loanTerms: { value: string | number }[]
  }
}

export function AdditionalEquipment({ requisites, disabled = false, options, isError, errorMessage }: Props) {
  const classes = useStyles()
  const [field] = useField(ServicesGroupName.additionalEquipments)

  const { ids, changeIds } = useAdditionalServiceIds()
  const isInitialExpanded = !!field.value.length && !!field.value[0].productType

  return (
    <AdditionalServicesContainer
      title="Дополнительное оборудование"
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
      isInitialExpanded={isInitialExpanded}
    >
      <FieldArray name={ServicesGroupName.additionalEquipments}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, index: number, arr: any[]) => (
              <React.Fragment key={ids[index]}>
                <AdditionalEquipmentRequisites
                  requisites={requisites}
                  index={index}
                  parentName={ServicesGroupName.additionalEquipments}
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
