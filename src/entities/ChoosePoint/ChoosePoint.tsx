import React, { useCallback, useState } from 'react'
import { KeyboardArrowDown } from '@mui/icons-material'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { InputAdornment } from '@mui/material'
import {
  pointsOfSaleFilter,
  retrieveLabelForPointOfSale,
  savePointOfSaleToCookies,
} from 'entities/ChoosePoint/ChoosePoint.utils'
import { Vendor } from '@sberauto/authdc-proto/public'
import { useGetVendorListQuery } from 'shared/api/pointsOfSale.api'
import SberTypography from 'shared/ui/SberTypography'
import useStyles from './ChoosePoint.styles'
import { useNavigate } from 'react-router-dom'
import { defaultRoute } from 'app/Router/Router.utils'
import DoneIcon from '@mui/icons-material/Done'
import { theme } from 'app/theme'

type Props = { value?: Vendor; isHeader?: boolean; onSuccessEditing?: () => void }

export const ChoosePoint = ({ value, isHeader, onSuccessEditing }: Props) => {
  const classes = useStyles()
  const navigate = useNavigate()

  const {
    // data,
    error,
    isLoading,
  } = useGetVendorListQuery({ userLogin: 'mockLogin' })
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
    navigate(defaultRoute)
  }, [navigate, chosenOption, onSuccessEditing])

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
          isOptionEqualToValue={(option, value) => option.vendorCode === value.vendorCode}
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
              size={isHeader ? 'small' : 'medium'}
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
                  </InputAdornment>
                ),
              }}
              placeholder="ТТ или адрес"
            />
          )}
        />

        {/* в хедере не показываем текст ошибки, согласовано с Максимом Мезенцевым */}
        {validationError && !isHeader && (
          <SberTypography className={classes.errorMessage} component="span" sberautoVariant="body5">
            Необходимо выбрать автосалон
          </SberTypography>
        )}
      </Box>

      {isHeader ? (
        <Button
          size="small"
          variant="contained"
          data-testid="choosePointIconButton"
          className={classes.button}
          onClick={validatePointOfSale}
        >
          <DoneIcon htmlColor={theme.palette.text.primary} />
        </Button>
      ) : (
        <Button variant="contained" className={classes.loginButton} onClick={validatePointOfSale}>
          Войти
        </Button>
      )}

      <Dialog open={isDialogOpen} maxWidth="xs" fullWidth>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <DialogContent>
            <DialogContentText>Вы выбрали точку:</DialogContentText>
            {chosenOption && (
              <DialogContentText>{retrieveLabelForPointOfSale(chosenOption)}</DialogContentText>
            )}
            <DialogContentText>Все верно?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" autoFocus onClick={onAgree}>
              Да
            </Button>
            <Button variant="outlined" onClick={onDisagree}>
              Нет
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
