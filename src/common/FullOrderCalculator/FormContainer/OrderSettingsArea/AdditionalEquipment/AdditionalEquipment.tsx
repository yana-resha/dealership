import { Box } from '@mui/material'
import { FieldArray, useField } from 'formik'

import {
  AdditionalServicesContainer,
  FormFieldNameMap,
  useAdditionalServiceIds,
} from 'entities/OrderCalculator'

import useStyles from './AdditionalEquipment.styles'
import { AdditionalEquipmentItem } from './AdditionalEquipmentItem/AdditionalEquipmentItem'

type Props = {
  disabled?: boolean
}

export function AdditionalEquipment({ disabled = false }: Props) {
  const classes = useStyles()
  const [field] = useField(FormFieldNameMap.additionalEquipments)

  const { ids, changeIds } = useAdditionalServiceIds()

  return (
    <AdditionalServicesContainer title="Дополнительное оборудование" disabled={disabled}>
      <FieldArray name={FormFieldNameMap.additionalEquipments}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, i: number, arr: any[]) => (
              <AdditionalEquipmentItem
                key={ids[i]}
                parentName={FormFieldNameMap.additionalEquipments}
                index={i}
                arrayHelpers={arrayHelpers}
                arrayLength={arr.length}
                changeIds={changeIds}
              />
            ))}
          </Box>
        )}
      </FieldArray>
    </AdditionalServicesContainer>
  )
}
