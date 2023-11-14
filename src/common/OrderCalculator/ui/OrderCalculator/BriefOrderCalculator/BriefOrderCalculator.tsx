import { Box } from '@mui/material'
import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { Formik } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useInitialValues } from 'common/OrderCalculator/hooks/useInitialValues'
import { useOrderCalculator } from 'common/OrderCalculator/hooks/useOrderCalculator'

import { useStyles } from './BriefOrderCalculator.styles'
import { FormContainer } from './FormContainer/FormContainer'
import { briefOrderFormValidationSchema } from './utils/briefOrderFormValidation'

type Props = {
  isSubmitLoading: boolean
  onSubmit: (data: CalculateCreditRequest, onSuccess: () => void) => void
  onChangeForm: (saveValuesToStoreCb: () => void) => void
}

export function BriefOrderCalculator({ isSubmitLoading, onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const { remapApplicationValues, initialValues, hasCustomInitialValues } = useInitialValues(
    initialValueMap,
    undefined,
  )
  const { formRef, isDisabled, enableFormSubmit, handleSubmit } = useOrderCalculator(
    remapApplicationValues,
    onSubmit,
  )

  return (
    <Box className={classes.formContainer} data-testid="orderCalculatorForm">
      <Formik
        initialValues={initialValues}
        validationSchema={briefOrderFormValidationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        <FormContainer
          isSubmitLoading={isSubmitLoading}
          shouldFetchProductsOnStart={hasCustomInitialValues}
          onChangeForm={onChangeForm}
          remapApplicationValues={remapApplicationValues}
          isDisabledFormSubmit={isDisabled}
          enableFormSubmit={enableFormSubmit}
        />
      </Formik>
    </Box>
  )
}
