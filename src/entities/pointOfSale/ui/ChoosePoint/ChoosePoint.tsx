import React, { useCallback, useMemo, useState } from 'react'

import { AutocompleteRenderInputParams, Collapse, DialogContentText, useTheme } from '@mui/material'
import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { InputAdornment } from '@mui/material'
import { Vendor } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

import { ReactComponent as DoneIcon } from 'assets/icons/done.svg'
import { ReactComponent as KeyboardArrowDown } from 'assets/icons/keyboardArrowDown.svg'
import { defaultRoute } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography'

import { useGetVendorsListQuery } from './ChoosePoint.api'
import useStyles from './ChoosePoint.styles'
import {
  pointsOfSaleFilter,
  retrieveLabelForPointOfSale,
  savePointOfSaleToCookies,
} from './ChoosePoint.utils'

type Props = { value?: Vendor; isHeader?: boolean; onSuccessEditing?: () => void }

export const ChoosePoint = ({ value, isHeader, onSuccessEditing }: Props) => {
  const classes = useStyles()
  const theme = useTheme()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, error, isLoading } = useGetVendorsListQuery()
  const [chosenOption, setChosenOption] = useState<Vendor | null>(value ?? null)
  const [validationError, setValidationError] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const handleAutocompleteOptionChange = useCallback((event: React.SyntheticEvent, option: Vendor | null) => {
    setChosenOption(option)
  }, [])

  const disableErrorState = useCallback(() => {
    setValidationError(false)
  }, [])

  const validatePointOfSale = useCallback(() => {
    if (chosenOption == null) {
      setValidationError(true)
    } else {
      setIsDialogOpen(true)
    }
  }, [chosenOption])

  const onDisagree = useCallback(() => {
    setIsDialogOpen(false)
    setChosenOption(null)
  }, [])

  const onAgree = useCallback(() => {
    savePointOfSaleToCookies(chosenOption)
    setIsDialogOpen(false)
    onSuccessEditing && onSuccessEditing()
    queryClient.resetQueries()
    navigate(defaultRoute)
  }, [navigate, chosenOption, onSuccessEditing, queryClient])

  const calculateIsOptionEqualToValue = useCallback(
    (option: Vendor, value: Vendor) => option.vendorCode === value.vendorCode,
    [],
  )

  const getOptionLabel = useCallback((option: Vendor) => retrieveLabelForPointOfSale(option), [])

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        error={validationError}
        className={classes.autocompleteTextField}
        {...params}
        size={isHeader ? 'small' : 'medium'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              {isLoading ? (
                <Box position="absolute" top="calc(40% - 10px)" right={9}>
                  <CircularProgressWheel size="small" />
                </Box>
              ) : (
                params.InputProps.endAdornment
              )}
            </InputAdornment>
          ),
        }}
        placeholder="ТТ или адрес"
      />
    ),
    [classes.autocompleteTextField, isHeader, isLoading, validationError],
  )

  const errorMessage = useMemo(() => {
    if (error) {
      return 'Произошла неизвестная ошибка! Перезагрузите страницу и попробуйте снова'
    }
    /* в хедере не показываем текст ошибки, согласовано с Максимом Мезенцевым (дизайнер) */
    if (validationError && !isHeader) {
      return 'Необходимо выбрать автосалон'
    }

    return undefined
  }, [error, isHeader, validationError])

  const renderError = useCallback(
    (errorMessage: string | undefined) => {
      if (!errorMessage) {
        return null
      }

      return (
        <Collapse in={!!errorMessage} timeout="auto" unmountOnExit>
          <SberTypography className={classes.errorMessage} component="span" sberautoVariant="body5">
            {errorMessage}
          </SberTypography>
        </Collapse>
      )
    },
    [classes.errorMessage],
  )

  return (
    <>
      <Box className={classes.autocompleteContainer}>
        <Autocomplete
          popupIcon={<KeyboardArrowDown />}
          className={classes.pointsOfSaleAutocomplete}
          noOptionsText="Ничего не найдено"
          loading={isLoading}
          fullWidth
          value={chosenOption}
          isOptionEqualToValue={calculateIsOptionEqualToValue}
          loadingText="Загрузка..."
          options={data ?? []}
          getOptionLabel={getOptionLabel}
          filterOptions={pointsOfSaleFilter}
          onChange={handleAutocompleteOptionChange}
          onFocus={disableErrorState}
          renderInput={renderInput}
        />
        {renderError(errorMessage)}
      </Box>

      {isHeader ? (
        <Button
          size="small"
          variant="contained"
          data-testid="choosePointIconButton"
          className={classes.button}
          onClick={validatePointOfSale}
        >
          <DoneIcon width="17px" color={theme.palette.text.primary} />
        </Button>
      ) : (
        <Button
          variant="contained"
          className={classes.loginButton}
          onClick={validatePointOfSale}
          disabled={!!error}
        >
          Войти
        </Button>
      )}

      <ModalDialog isVisible={isDialogOpen} onClose={onDisagree} testId="choosePointModal">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box>
            <DialogContentText className={classes.dialogText}>Вы выбрали точку:</DialogContentText>
            {chosenOption && (
              <DialogContentText className={classes.dialogText}>
                {retrieveLabelForPointOfSale(chosenOption)}
              </DialogContentText>
            )}
            <DialogContentText className={cx(classes.dialogText, classes.lastDialogText)}>
              Все верно?
            </DialogContentText>
          </Box>

          <Box>
            <Button variant="contained" autoFocus onClick={onAgree} className={classes.dialogBtn}>
              Да
            </Button>
            <Button variant="outlined" onClick={onDisagree} className={classes.dialogBtn}>
              Нет
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </>
  )
}
