import { useEffect } from 'react'

import { Box, Button } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { legalPersons } from 'common/FullOrderCalculator/__tests__/FullOrderCalculator.mock'
import { carBrands, carModels, creditProducts } from 'common/OrderCalculator/__tests__/OrderCalculator.mock'
import {
  AreaFooter,
  CAR_CONDITIONS,
  CAR_PASSPORT_TYPE,
  FormFieldNameMap,
  INITIAL_CAR_ID_TYPE,
  carYears,
} from 'entities/orderCalculator'
import { usePrevious } from 'shared/hooks/usePrevious'
import {
  maskVin,
  maskOnlyDigitsWithSeparator,
  maskNoRestrictions,
  maskElectronicСarPassportId,
  maskСarPassportId,
} from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { BankDetails } from '../BankDetails/BankDetails'
import useStyles from './CarSettingsArea.styles'

export function CarSettingsArea() {
  const classes = useStyles()
  const { setFieldValue } = useFormikContext()

  const [carPassportTypeField] = useField(FormFieldNameMap.carPassportType)
  const prevCarPassportType = usePrevious(carPassportTypeField.value)
  useEffect(() => {
    if (carPassportTypeField.value !== prevCarPassportType) {
      setFieldValue(FormFieldNameMap.carPassportId, '')
    }
  }, [carPassportTypeField.value, prevCarPassportType, setFieldValue])

  return (
    <CollapsibleFormAreaContainer title="Автомобиль">
      <Box className={classes.wrapper}>
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
          />
          <DateInputFormik
            name={FormFieldNameMap.carPassportCreationDate}
            label="Дата выдачи ПТС"
            gridColumn="span 1"
          />
        </Box>
        <Box className={classes.gridContainer}>
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
        <Box className={classes.gridContainer}>
          <SelectInputFormik
            name={FormFieldNameMap.legalPerson}
            label="Юридическое лицо"
            placeholder="-"
            options={legalPersons}
            gridColumn="span 2"
          />
          <MaskedInputFormik
            name={FormFieldNameMap.loanAmount}
            label="Сумма кредита"
            placeholder="-"
            mask={maskOnlyDigitsWithSeparator}
            gridColumn="span 2"
          />
        </Box>
        <BankDetails />
        <AreaFooter btnTitle="Показать" />
      </Box>
    </CollapsibleFormAreaContainer>
  )
}
