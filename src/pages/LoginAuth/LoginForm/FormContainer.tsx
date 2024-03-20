import { useEffect, useState } from 'react'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Box, Button, IconButton, InputAdornment } from '@mui/material'
import { Form, useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'

import { theme } from 'app/theme'
import { usePrevious } from 'shared/hooks/usePrevious'
import { maskNoRestrictions } from 'shared/masks/InputMasks'
import { AdornmentInputFormik } from 'shared/ui/AdornmentInput/AdornmentInputFormik'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography'

import { FormFieldMap, LoginFormFields } from '../types'
import { useStyles } from './LoginForm.styles'

type Props = {
  isSubmitLoading: boolean
  isDisabledSubmit: boolean
  errorMessage?: string
  onChangeForm: () => void
}

export function FormContainer({
  isSubmitLoading = false,
  isDisabledSubmit,
  errorMessage,
  onChangeForm,
}: Props) {
  const classes = useStyles()
  const [isShowPassword, setShowPassword] = useState(false)

  const { values } = useFormikContext<LoginFormFields>()
  const prevValues = usePrevious(values)

  useEffect(() => {
    if (!isEqual(values, prevValues)) {
      onChangeForm()
    }
  }, [onChangeForm, prevValues, values])

  const handleShowPasswordClick = () => setShowPassword(show => !show)

  return (
    <Form>
      <Box className={classes.gridContainer}>
        <MaskedInputFormik
          name={FormFieldMap.login}
          label="Логин"
          placeholder="-"
          mask={maskNoRestrictions}
        />
        <AdornmentInputFormik
          name={FormFieldMap.password}
          label="Пароль"
          placeholder="-"
          mask={maskNoRestrictions}
          type={isShowPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPasswordClick}
                edge="end"
              >
                {isShowPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
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
        disabled={!values.login || !values.password || isSubmitLoading || isDisabledSubmit}
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
