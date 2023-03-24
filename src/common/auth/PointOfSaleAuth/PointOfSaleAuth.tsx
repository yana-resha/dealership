import React, { useCallback, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowLeft } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import { Autocomplete, Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { InputAdornment } from '@mui/material'
import {
  pointsOfSaleFilter,
  retrieveLabelForPointOfSale,
  savePointOfSaleToCookies,
} from 'common/auth/PointOfSaleAuth/pointsOfSale.utils'
import { Vendor } from '@sberauto/authdc-proto/public'
import { useGetVendorListQuery } from 'shared/api/pointsOfSale.api'
import SberTypography from 'shared/ui/SberTypography'
import useStyles from './PointOfSaleAuth.styles'
import { useNavigate } from 'react-router-dom'
import { appRoutePaths, defaultRoute } from 'app/Router/Router.utils'

export function PointOfSaleAuth() {
  const classes = useStyles()
  const navigate = useNavigate()

  const { data, error, isLoading } = useGetVendorListQuery({ userLogin: 'mockLogin' })
  const [chosenOption, setChosenOption] = useState<Vendor | null>(null)
  const [validationError, setValidationError] = useState<boolean>(false)

  const handleAutocompleteOptionChange = useCallback((event: React.SyntheticEvent, option: Vendor | null) => {
    setChosenOption(option)
  }, [])

  const disableErrorState = useCallback(() => {
    setValidationError(false)
  }, [])

  const validateAndSavePointOfSale = useCallback(() => {
    if (chosenOption == null) {
      setValidationError(true)
    } else {
      savePointOfSaleToCookies(chosenOption)
      navigate(defaultRoute)
    }
  }, [chosenOption, navigate])

  const onBackClick = useCallback(() => {
    navigate(appRoutePaths.auth)
  }, [navigate])

  return (
    <Box className={classes.pointOfSaleFormContainer}>
      <IconButton className={classes.backArrow} onClick={onBackClick} data-testid="backButton">
        <KeyboardArrowLeft />
      </IconButton>

      <Avatar className={classes.avatarContainer} data-testid="avatar">
        {' '}
      </Avatar>

      <Typography className={classes.formMessage}>Выберите автосалон</Typography>

      <Box className={classes.autocompleteContainer}>
        <Autocomplete
          popupIcon={<KeyboardArrowDown />}
          className={classes.pointsOfSaleAutocomplete}
          noOptionsText="Ничего не найдено"
          loading={isLoading}
          loadingText="Загрузка..."
          options={(error as Vendor[]) ?? []}
          getOptionLabel={option => retrieveLabelForPointOfSale(option)}
          filterOptions={pointsOfSaleFilter}
          onChange={handleAutocompleteOptionChange}
          onFocus={disableErrorState}
          renderInput={params => (
            <TextField
              error={validationError}
              className={classes.autocompleteTextField}
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoading ? (
                      <Box position="absolute" top="calc(50% - 10px)" right={9}>
                        <CircularProgress color="inherit" size={20} data-testid="loadingImg" />
                      </Box>
                    ) : (
                      params.InputProps.endAdornment
                    )}
                    {/* {params.InputProps.endAdornment} */}
                  </InputAdornment>
                ),
              }}
              placeholder="ТТ или адрес"
            />
          )}
        />

        {validationError && (
          <SberTypography className={classes.errorMessage} component="span" sberautoVariant="body5">
            Необходимо выбрать автосалон
          </SberTypography>
        )}
      </Box>

      <Button variant="contained" className={classes.loginButton} onClick={validateAndSavePointOfSale}>
        Войти
      </Button>
    </Box>
  )
}
