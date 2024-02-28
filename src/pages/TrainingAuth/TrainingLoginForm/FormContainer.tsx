import { useState } from 'react'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Box, Button, IconButton, InputAdornment } from '@mui/material'
import { Form, useFormikContext } from 'formik'

import { theme } from 'app/theme'
import { maskNoRestrictions } from 'shared/masks/InputMasks'
import { AdornmentInputFormik } from 'shared/ui/AdornmentInput/AdornmentInputFormik'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'

import { useStyles } from './TrainingLoginForm.styles'
import { FormFieldMap, LoginFormFields } from './types'

export function FormContainer({ isSubmitLoading = false }) {
  const classes = useStyles()
  const { values } = useFormikContext<LoginFormFields>()
  const [isShowPassword, setShowPassword] = useState(false)

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
        <Button
          type="submit"
          className={classes.submitBtn}
          variant="contained"
          disabled={!values.login || !values.password || isSubmitLoading}
          data-testid="loginButton"
        >
          {isSubmitLoading ? (
            <CircularProgressWheel size="small" color={theme.palette.background.default} />
          ) : (
            'Продолжить'
          )}
        </Button>
      </Box>
    </Form>
  )
}
