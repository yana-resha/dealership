import React from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { FullInitialAdditionalEquipments } from 'common/OrderCalculator/types'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { PreparedAdditionalEquipmentForFinancingMap } from 'entities/application/DossierAreas/hooks/useRequisitesForFinancingQuery'
import { AdditionalEquipmentRequisites } from 'entities/application/DossierAreas/ui'

import useStyles from './AdditionalEquipment.styles'

type Props = {
  optionsRequisitesMap: Record<string, PreparedAdditionalEquipmentForFinancingMap>
  disabled?: boolean
  isError?: boolean
  errorMessage?: string
  options: {
    productType: { value: string | number; label: string }[]
    loanTerms: { value: string | number }[]
  }
}

export function AdditionalEquipment({
  optionsRequisitesMap,
  disabled = false,
  options,
  isError,
  errorMessage,
}: Props) {
  const classes = useStyles()
  const [field] = useField<FullInitialAdditionalEquipments[]>(ServicesGroupName.additionalEquipments)

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
            {field.value.map((v, index: number, arr: any[]) => (
              <React.Fragment key={ids[index]}>
                <AdditionalEquipmentRequisites
                  optionRequisite={v.productType ? optionsRequisitesMap[v.productType] : undefined}
                  index={index}
                  parentName={ServicesGroupName.additionalEquipments}
                  isRequisiteEditable={true}
                  productOptions={options.productType}
                  arrayHelpers={arrayHelpers}
                  arrayLength={arr.length}
                  equipmentItem={v}
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
