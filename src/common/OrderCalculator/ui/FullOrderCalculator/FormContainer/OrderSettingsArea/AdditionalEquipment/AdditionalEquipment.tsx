import React, { useMemo } from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { RequisitesAdditionalOptions } from 'entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { AdditionalEquipmentRequisites } from 'entities/application/DossierAreas/ui'

import { ADDITIONAL_EQUIPMENTS } from '../../../../../config'
import useStyles from './AdditionalEquipment.styles'

type Props = {
  requisites: RequisitesAdditionalOptions[]
  disabled?: boolean
}

export function AdditionalEquipment({ requisites, disabled = false }: Props) {
  const classes = useStyles()
  const [field] = useField(ServicesGroupName.additionalEquipments)
  const additionalEquipments = useMemo(
    () => ADDITIONAL_EQUIPMENTS.map(o => ({ value: o.type, label: o.optionName })),
    [],
  )

  const { ids, changeIds } = useAdditionalServiceIds()

  const isInitialExpanded = !!field.value.length && !!field.value[0].productType

  return (
    <AdditionalServicesContainer
      title="Дополнительное оборудование"
      disabled={disabled}
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
                  productOptions={additionalEquipments}
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
