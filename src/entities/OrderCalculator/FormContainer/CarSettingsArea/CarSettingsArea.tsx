import { Box } from '@mui/material'

import { carBrands, carModels, creditProducts } from 'entities/OrderCalculator/__tests__/OrderCalculator.mock'
import { maskOnlyNumbersWithSeparator } from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { CAR_CONDITIONS, carYears, FormFieldNameMap } from '../../OrderCalculator.config'
import { FormAreaContainer } from '../FormAreaContainer/FormAreaContainer'
import useStyles from './CarSettingsArea.styles'

export function CarSettingsArea() {
  const classes = useStyles()

  return (
    <FormAreaContainer title="Автомобиль">
      <Box className={classes.gridContainer}>
        <SelectInputFormik
          name={FormFieldNameMap.carCondition}
          label="Состояние"
          placeholder="-"
          options={CAR_CONDITIONS}
          gridColumn="span 1"
        />
        <AutocompleteInputFormik
          name={FormFieldNameMap.carBrand}
          label="Марка"
          placeholder="-"
          options={carBrands}
          gridColumn="span 1"
        />
        <AutocompleteInputFormik
          name={FormFieldNameMap.carModel}
          label="Модель"
          placeholder="-"
          options={carModels}
          gridColumn="span 1"
        />
        <SelectInputFormik
          name={FormFieldNameMap.carYear}
          label="Год выпуска"
          placeholder="-"
          options={carYears}
          gridColumn="span 1"
        />
        <MaskedInputFormik
          name={FormFieldNameMap.carCost}
          label="Стоимость"
          placeholder="-"
          mask={maskOnlyNumbersWithSeparator}
          gridColumn="span 1"
        />
        <MaskedInputFormik
          name={FormFieldNameMap.carMileage}
          label="Пробег"
          placeholder="-"
          mask={maskOnlyNumbersWithSeparator}
          gridColumn="span 1"
        />
        <SelectInputFormik
          name={FormFieldNameMap.creditProduct}
          label="Кредитный продукт"
          placeholder="-"
          options={creditProducts}
          gridColumn="span 2"
          emptyAvailable
        />
      </Box>
    </FormAreaContainer>
  )
}
