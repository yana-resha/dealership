import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Button, IconButton } from '@mui/material'

import { theme } from 'app/theme'
import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'
import { useCheckCodeMutation } from 'shared/api/requests/authdc'
import { maskDigitsOnly } from 'shared/masks/InputMasks'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './SMSCode.styles'
import { useTimer } from './useTimer'

const SECOND_TO_NEW_REQUEST_CODE = 55
const CODE_LENGTH = 6

type Props = {
  login: string
  isLoading: boolean
  requireCode: (onSuccess: () => void, onError: (err: CustomFetchError) => void) => void
  onBack: () => void
}

export function SMSCode({ login, isLoading, requireCode, onBack }: Props) {
  const classes = useStyles()

  const inputRef = useRef<HTMLInputElement>()
  const [value, setValue] = useState('')
  const [isDisabledInput, setDisabledInput] = useState(false)
  const [isDisabledButton, setDisabledButton] = useState(true)
  const [isShowTimer, setShowTimer] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  const { mutate: checkCodeMutate, isLoading: isCheckCodeMutateLoading } = useCheckCodeMutation()
  const { startTimer, clearTimer, secondsToEnd } = useTimer()

  const startCodeTimer = useCallback(() => {
    setShowTimer(true)
    setDisabledButton(true)
    startTimer(Date.now() + SECOND_TO_NEW_REQUEST_CODE * 1000, () => {
      setShowTimer(false)
      setDisabledButton(false)
    })
  }, [startTimer])

  const handleChange = useCallback((value: string) => {
    if (value.length <= CODE_LENGTH) {
      setValue(value)
    }
  }, [])

  const handleError = useCallback(
    (err: CustomFetchError, serviceApi: ServiceApi) => {
      const errorMessage = getErrorMessage({
        service: Service.Authdc,
        serviceApi,
        code: err.code as ErrorCode,
        alias: err.alias as ErrorAlias,
      })
      setErrorMessage(errorMessage)

      switch (err.alias) {
        case ErrorAlias.CheckCode_WrongCode:
          setValue('')
          setDisabledInput(false)
          break
        case ErrorAlias.CheckCode_InactiveCode:
        case ErrorAlias.AuthorizeUser_UserBlockedBySmsCount:
          setValue('')
          setShowTimer(false)
          setDisabledInput(true)
          setDisabledButton(true)
          clearTimer()
          break
        default:
          setValue('')
          setDisabledInput(false)
      }
    },
    [clearTimer],
  )

  const handleClick = useCallback(() => {
    requireCode(
      () => startCodeTimer(),
      err => handleError(err, ServiceApi.AuthorizeUser),
    )
  }, [handleError, requireCode, startCodeTimer])

  useEffect(() => {
    startCodeTimer()
    setTimeout(() => inputRef.current?.focus(), 1000)
  }, [startCodeTimer])

  useEffect(() => {
    if (value.length === CODE_LENGTH) {
      setDisabledInput(true)
      setErrorMessage(undefined)
      checkCodeMutate(
        { login, code: value },
        {
          onError: err => handleError(err, ServiceApi.CheckCode),
        },
      )
    }
  }, [checkCodeMutate, handleError, login, value])

  const formattedSecondsToEnd = secondsToEnd < 10 ? `0${secondsToEnd}` : secondsToEnd

  return (
    <Box className={classes.container}>
      <Box className={classes.inputContainer}>
        <IconButton className={classes.backArrow} onClick={onBack} data-testid="backButton">
          <KeyboardArrowLeft />
        </IconButton>

        <MaskedInput
          name="SMSCode"
          label="СМС код"
          placeholder="-"
          mask={maskDigitsOnly}
          value={value}
          onChange={handleChange}
          disabled={isDisabledInput}
          InputProps={{
            inputRef,
          }}
        />

        {isCheckCodeMutateLoading && <CircularProgressWheel size="large" />}
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

      <Box className={classes.timerContainer}>
        {isShowTimer && (
          <SberTypography
            className={classes.timer}
            component="p"
            sberautoVariant="body3"
            data-testid="loginFormTitle"
          >
            Повторный запрос СМС-кода будет возможен через 00:{formattedSecondsToEnd}
          </SberTypography>
        )}

        <Button
          className={classes.requireBtn}
          variant="contained"
          disabled={isDisabledButton}
          data-testid="loginButton"
          onClick={handleClick}
        >
          {isLoading ? (
            <CircularProgressWheel size="small" color={theme.palette.background.default} />
          ) : (
            'Новый СМС-код'
          )}
        </Button>
      </Box>
    </Box>
  )
}
