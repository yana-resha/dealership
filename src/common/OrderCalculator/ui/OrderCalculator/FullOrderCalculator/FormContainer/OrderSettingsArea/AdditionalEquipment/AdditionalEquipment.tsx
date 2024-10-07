import React, { useEffect, useMemo } from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { FULL_INITIAL_ADDITIONAL_EQUIPMENTS } from 'common/OrderCalculator/config'
import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { useAdditionalServicesGroupe } from 'common/OrderCalculator/hooks/useAdditionalServicesGroupe'
import { NonNullableAdditionalOption } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { FullInitialAdditionalEquipment } from 'common/OrderCalculator/types'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { AdditionalEquipmentRequisites } from 'entities/applications/AdditionalOptionsRequisites/ui'

import useStyles from './AdditionalEquipment.styles'

type Props = {
  disabled?: boolean
  isError?: boolean
  errorMessage?: string
  options: {
    productType: NonNullableAdditionalOption[]
    loanTerms: { value: number }[]
  }
}

export function AdditionalEquipment({ disabled = false, options, isError, errorMessage }: Props) {
  const classes = useStyles()
  const [field] = useField<FullInitialAdditionalEquipment[]>(ServicesGroupName.additionalEquipments)

  const { ids, changeIds } = useAdditionalServiceIds()
  const { isInitialExpanded, isShouldExpanded, resetShouldExpanded } = useAdditionalServicesGroupe(
    ServicesGroupName.additionalEquipments,
    FULL_INITIAL_ADDITIONAL_EQUIPMENTS,
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
      title="Дополнительное оборудование"
      name={ServicesGroupName.additionalEquipments}
      initialValues={FULL_INITIAL_ADDITIONAL_EQUIPMENTS}
      isShouldExpanded={isShouldExpanded}
      resetShouldExpanded={resetShouldExpanded}
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
                  index={index}
                  parentName={ServicesGroupName.additionalEquipments}
                  isRequisiteEditable={true}
                  productOptions={productOptions}
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
