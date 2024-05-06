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

import { FormFieldMap, PasswordFormFields } from '../types'
import { useStyles } from './PasswordForm.styles'

type Props = {
  isSubmitLoading: boolean
  errorMessage?: string
  onChangeForm: () => void
}

export function FormContainer({ isSubmitLoading = false, errorMessage, onChangeForm }: Props) {
  const classes = useStyles()
  const [isShowPassword, setShowPassword] = useState(false)
  const [isShowControlPassword, setShowControlPassword] = useState(false)

  const { values } = useFormikContext<PasswordFormFields>()
  const prevValues = usePrevious(values)

  useEffect(() => {
    if (!isEqual(values, prevValues)) {
      onChangeForm()
    }
  }, [onChangeForm, prevValues, values])

  const handleShowPasswordClick = () => setShowPassword(show => !show)
  const handleShowControlPasswordClick = () => setShowControlPassword(show => !show)

  const isDisabledSubmitBtn = !values.code || !values.password || !values.controlPassword || isSubmitLoading

  return (
    <Form>
      <Box className={classes.gridContainer}>
        <MaskedInputFormik
          name={FormFieldMap.CODE}
          label="Код из Email"
          placeholder="-"
          mask={maskNoRestrictions}
        />
        <AdornmentInputFormik
          name={FormFieldMap.PASSWORD}
          label="Новый пароль"
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
        <AdornmentInputFormik
          name={FormFieldMap.CONTROL_PASSWORD}
          label="Подтвердите пароль"
          placeholder="-"
          mask={maskNoRestrictions}
          type={isShowControlPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowControlPasswordClick}
                edge="end"
              >
                {isShowControlPassword ? <VisibilityOff /> : <Visibility />}
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
        disabled={isDisabledSubmitBtn}
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
