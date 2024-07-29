import { Box } from '@mui/material'

import { CAR_CONDITIONS } from 'common/OrderCalculator/config'
import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import { useCarBrands } from 'common/OrderCalculator/hooks/useCarBrands'
import { useCarSettings } from 'common/OrderCalculator/hooks/useCarSettings'
import { useCarYears } from 'common/OrderCalculator/hooks/useCarYears'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { maskMileage, maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './CarSettingsArea.styles'

type Props = {
  /** Срабатывает когда форма заполнена */
  onFilled: () => void
  visibleFooter: boolean
  isLoading?: boolean
}

export function CarSettingsArea({ onFilled, visibleFooter, isLoading }: Props) {
  const styles = useStyles()

  const { carBrands, carModels, isDisabledCarModel, isCarsLoading, isCarLoaded, isCarError } = useCarBrands()
  const { carYears } = useCarYears()
  const { handleBtnClick } = useCarSettings(onFilled)
  const isSectionLoading = isLoading || isCarsLoading
  const isSectionLoaded = !isLoading && isCarLoaded

  return (
    <CollapsibleFormAreaContainer title="Автомобиль">
      {isSectionLoading && (
        <Box className={styles.loaderContainer}>
          <CircularProgressWheel size="large" />
        </Box>
      )}

      {isSectionLoaded && (
        <Box className={styles.gridContainer}>
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
            label="Пробег, тыс. км"
            placeholder="-"
            mask={maskMileage}
            gridColumn="span 1"
          />

          {visibleFooter && (
            <AreaFooter btnTitle="Показать" onClickBtn={handleBtnClick} isLoadingBtn={isLoading} />
          )}
        </Box>
      )}

      {isCarError && (
        <Box className={styles.errorList}>
          <SberTypography sberautoVariant="body3" component="p">
            {DEFAULT_DATA_LOADING_ERROR_MESSAGE}
          </SberTypography>
        </Box>
      )}
    </CollapsibleFormAreaContainer>
  )
}
