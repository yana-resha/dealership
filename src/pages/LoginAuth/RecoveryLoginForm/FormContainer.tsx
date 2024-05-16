import { useEffect } from 'react'

import { Box, Button } from '@mui/material'
import { Form, useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'

import { theme } from 'app/theme'
import { usePrevious } from 'shared/hooks/usePrevious'
import { maskNoRestrictions } from 'shared/masks/InputMasks'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography'

import { FormFieldMap, RecoveryLoginFormFields } from '../types'
import { useStyles } from './RecoveryLoginForm.styles'

type Props = {
  isSubmitLoading: boolean
  errorMessage?: string
  onChangeForm: () => void
}

export function FormContainer({ isSubmitLoading = false, errorMessage, onChangeForm }: Props) {
  const classes = useStyles()

  const { values } = useFormikContext<RecoveryLoginFormFields>()
  const prevValues = usePrevious(values)

  useEffect(() => {
    if (!isEqual(values, prevValues)) {
      onChangeForm()
    }
  }, [onChangeForm, prevValues, values])

  return (
    <Form>
      <Box className={classes.gridContainer}>
        <MaskedInputFormik
          name={FormFieldMap.LOGIN}
          label="Логин"
          placeholder="-"
          mask={maskNoRestrictions}
        />

        {!!errorMessage && (
          <SberTypography
            className={classes.loginFormError}
            component="p"
            sberautoVariant="body3"
            data-testid="loginFormError"
          >
            {errorMessage}
          </SberTypography>
        )}
      </Box>

      <Button
        type="submit"
        className={classes.submitBtn}
        variant="contained"
        disabled={!values.login || isSubmitLoading}
        data-testid="loginButton"
      >
        {isSubmitLoading ? (
          <CircularProgressWheel size="small" color={theme.palette.background.default} />
        ) : (
          'Продолжить'
        )}
      </Button>
    </Form>
  )
}
