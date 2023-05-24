import { useCallback } from 'react'

import { Box } from '@mui/material'
import { IsClientRequest } from '@sberauto/loanapplifecycledc-proto/public'
import { Formik } from 'formik'

import { fullInitialValueMap } from 'entities/OrderCalculator'

import { FormContainer } from './FormContainer/FormContainer'
import { useStyles } from './FullOrderCalculator.styles'
import { fullOrderFormValidationSchema } from './fullOrderFormValidation.utils'

type Props = {
  onSubmit: (data: IsClientRequest) => void
  onChangeForm: () => void
}

export function FullOrderCalculator({ onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const handleSubmit = useCallback(
    (values: any) => {
      onSubmit(values)
    },
    [onSubmit],
  )

  return (
    <Box className={classes.formContainer} data-testid="fullOrderCalculatorForm">
      <Formik
        initialValues={fullInitialValueMap}
        validationSchema={fullOrderFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <FormContainer onChangeForm={onChangeForm} />
      </Formik>
    </Box>
  )
}
