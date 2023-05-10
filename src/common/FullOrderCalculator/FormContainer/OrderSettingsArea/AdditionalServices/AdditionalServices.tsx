import { useCallback, useState } from 'react'

import { Box } from '@mui/material'
import { FieldArray, useField } from 'formik'
import { v4 as uuidv4 } from 'uuid'

import { AdditionalServicesContainer, useAdditionalServiceIds } from 'entities/OrderCalculator'

import { AdditionalServiceItem } from './AdditionalServiceItem/AdditionalServiceItem'
import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: string[]
  name: string
  disabled?: boolean
}

export function AdditionalServices({ title, options, name, disabled = false }: Props) {
  const classes = useStyles()
  const [field] = useField(name)

  const { ids, changeIds } = useAdditionalServiceIds()

  return (
    <AdditionalServicesContainer title={title} disabled={disabled}>
      <FieldArray name={name}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, i: number, arr: any[]) => (
              <AdditionalServiceItem
                key={ids[i]}
                options={options}
                parentName={name}
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
