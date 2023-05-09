import { Box } from '@mui/material'

import { carBrands, carModels, creditProducts } from 'common/OrderCalculator/__tests__/OrderCalculator.mock'
import { CAR_CONDITIONS, carYears, FormFieldNameMap } from 'entities/orderCalculator'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './CarSettingsArea.styles'

export function CarSettingsArea() {
  const classes = useStyles()

  return (
    <CollapsibleFormAreaContainer title="Автомобиль">
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
          mask={maskOnlyDigitsWithSeparator}
          gridColumn="span 1"
        />
        <MaskedInputFormik
          name={FormFieldNameMap.carMileage}
          label="Пробег"
          placeholder="-"
          mask={maskOnlyDigitsWithSeparator}
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
    </CollapsibleFormAreaContainer>
  )
}
