import Box from '@mui/material/Box'
import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { Formik } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { useInitialValues } from 'common/OrderCalculator/hooks/useInitialValues'
import { useOrderCalculator } from 'common/OrderCalculator/hooks/useOrderCalculator'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'

import { FormContainer } from './FormContainer/FormContainer'
import { useStyles } from './FullOrderCalculator.styles'
import { fullOrderFormValidationSchema } from './fullOrderFormValidation.utils'

type Props = {
  isSubmitLoading: boolean
  onSubmit: (data: CalculateCreditRequest, onSuccess: () => void) => void
  onChangeForm: (saveValuesToStore: () => void) => void
}
export function FullOrderCalculator({ isSubmitLoading, onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const { remapApplicationValues, initialValues, hasCustomInitialValues } = useInitialValues(
    fullInitialValueMap,
    true,
  )
  const { formRef, isDisabled, enableFormSubmit, handleSubmit } = useOrderCalculator(
    remapApplicationValues,
    onSubmit,
  )

  return (
    <Box className={classes.formContainer} data-testid="fullOrderCalculatorForm">
      <Formik
        initialValues={initialValues as FullOrderCalculatorFields}
        validationSchema={fullOrderFormValidationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        <FormContainer
          isSubmitLoading={isSubmitLoading}
          onChangeForm={onChangeForm}
          shouldFetchProductsOnStart={hasCustomInitialValues}
          remapApplicationValues={remapApplicationValues}
          isDisabledFormSubmit={isDisabled}
          enableFormSubmit={enableFormSubmit}
        />
      </Formik>
    </Box>
  )
}
