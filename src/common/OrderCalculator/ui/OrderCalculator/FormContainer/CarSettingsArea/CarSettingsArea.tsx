import { Box } from '@mui/material'
import { useField } from 'formik'

import { CAR_CONDITIONS } from 'common/OrderCalculator/config'
import { useCarBrands } from 'common/OrderCalculator/hooks/useCarBrands'
import { useCarSettings } from 'common/OrderCalculator/hooks/useCarSettings'
import { useCarYears } from 'common/OrderCalculator/hooks/useCarYears'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './CarSettingsArea.styles'

type Props = {
  /** Срабатывает когда форма заполнена */
  onFilled: () => void
  isLoading?: boolean
}

export function CarSettingsArea({ onFilled, isLoading }: Props) {
  const classes = useStyles()

  const { carBrands, carModels, isDisabledCarModel } = useCarBrands()
  const { carYears } = useCarYears()
  const { handleBtnClick } = useCarSettings(onFilled)

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
          disabled={isDisabledCarModel}
        />
        <SelectInputFormik
          name={FormFieldNameMap.carYear}
          label="Год выпуска"
          placeholder="-"
          options={carYears}
          gridColumn="span 1"
          emptyAvailable
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

        <AreaFooter btnTitle="Показать" onClickBtn={handleBtnClick} isLoadingBtn={isLoading} />
      </Box>
    </CollapsibleFormAreaContainer>
  )
}
