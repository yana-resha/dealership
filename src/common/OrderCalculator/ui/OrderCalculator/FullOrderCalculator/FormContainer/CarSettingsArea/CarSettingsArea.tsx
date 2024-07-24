import { useEffect } from 'react'

import { Box } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import {
  CAR_CONDITIONS,
  CAR_PASSPORT_TYPE,
  fullInitialValueMap,
  INITIAL_CAR_ID_TYPE,
} from 'common/OrderCalculator/config'
import { DEFAULT_DATA_LOADING_ERROR_MESSAGE } from 'common/OrderCalculator/constants'
import { useCarBrands } from 'common/OrderCalculator/hooks/useCarBrands'
import { useCarSettings } from 'common/OrderCalculator/hooks/useCarSettings'
import { useCarYears } from 'common/OrderCalculator/hooks/useCarYears'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { AreaFooter } from 'common/OrderCalculator/ui/AreaFooter/AreaFooter'
import { DealerCenterRequisites } from 'entities/application/AdditionalOptionsRequisites/ui'
import { usePrevious } from 'shared/hooks/usePrevious'
import {
  maskVin,
  maskOnlyDigitsWithSeparator,
  maskNoRestrictions,
  maskElectronicСarPassportId,
  maskСarPassportId,
  maskMileage,
} from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './CarSettingsArea.styles'

type Props = {
  onFilled: () => void
  visibleFooter: boolean
  isLoading?: boolean
}

export function CarSettingsArea({ onFilled, visibleFooter, isLoading }: Props) {
  const styles = useStyles()

  const { setFieldValue } = useFormikContext()
  const [carPassportTypeField] = useField(FormFieldNameMap.carPassportType)
  const prevCarPassportType = usePrevious(carPassportTypeField.value)

  const { carBrands, carModels, isDisabledCarModel, isCarsLoading, isCarLoaded, isCarError } = useCarBrands()
  const { carYears } = useCarYears()
  const { handleBtnClick } = useCarSettings(onFilled)

  const isSectionLoading = isLoading || isCarsLoading
  const isSectionLoaded = !isLoading && isCarLoaded

  useEffect(() => {
    if (carPassportTypeField.value !== prevCarPassportType) {
      setFieldValue(FormFieldNameMap.carPassportId, fullInitialValueMap[FormFieldNameMap.carPassportId])
    }
  }, [carPassportTypeField.value, prevCarPassportType, setFieldValue])

  return (
    <CollapsibleFormAreaContainer title="Автомобиль">
      {isSectionLoading && (
        <Box className={styles.loaderContainer}>
          <CircularProgressWheel size="large" />
        </Box>
      )}

      {isSectionLoaded && (
        <Box className={styles.wrapper} data-testid="carSettingsArea">
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
            <SelectInputFormik
              name={FormFieldNameMap.carPassportType}
              label="Тип ПТС"
              placeholder="-"
              options={CAR_PASSPORT_TYPE}
              gridColumn="span 2"
            />
            <MaskedInputFormik
              name={FormFieldNameMap.carPassportId}
              label="Серия и номер ПТС"
              placeholder="-"
              mask={carPassportTypeField.value ? maskElectronicСarPassportId : maskСarPassportId}
              gridColumn="span 1"
              disabled={carPassportTypeField.value === null}
            />
            <DateInputFormik
              name={FormFieldNameMap.carPassportCreationDate}
              label="Дата выдачи ПТС"
              gridColumn="span 1"
            />
          </Box>
          <Box className={styles.gridContainer}>
            <SelectInputFormik
              name={FormFieldNameMap.carIdType}
              label="VIN или номер кузова"
              placeholder="-"
              options={INITIAL_CAR_ID_TYPE}
              gridColumn="span 1"
            />
            <MaskedInputFormik
              name={FormFieldNameMap.carId}
              label="Номер VIN/кузова"
              placeholder="-"
              mask={maskVin}
              gridColumn="span 2"
            />
            <MaskedInputFormik
              name={FormFieldNameMap.salesContractId}
              label="Номер ДКП"
              placeholder="-"
              mask={maskNoRestrictions}
              gridColumn="span 1"
            />
            <DateInputFormik name={FormFieldNameMap.salesContractDate} label="Дата ДКП" gridColumn="span 1" />
          </Box>
          <DealerCenterRequisites isRequisiteEditable={true} />
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
