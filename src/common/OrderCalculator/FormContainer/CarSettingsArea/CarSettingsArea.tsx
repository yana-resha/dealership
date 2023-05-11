import { useCallback, useEffect, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { AreaFooter, CAR_CONDITIONS, carYears, FormFieldNameMap } from 'entities/orderCalculator'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetCarListQuery } from 'shared/api/dictionaryDc/dictionaryDc.api'
import { usePrevious } from 'shared/hooks/usePrevious'
import { maskOnlyDigitsWithSeparator } from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { CollapsibleFormAreaContainer } from 'shared/ui/CollapsibleFormAreaContainer/CollapsibleFormAreaContainer'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './CarSettingsArea.styles'

type Props = {
  onFilled: () => void
}

export function CarSettingsArea({ onFilled }: Props) {
  const classes = useStyles()
  const { errors, setFieldTouched } = useFormikContext()
  const [shouldChangeFillStatus, setShouldChangeFillStatus] = useState(false)
  const [isFilled, setFilled] = useState(false)

  const hasErrors = useMemo(
    () =>
      Object.keys(errors).some(
        k =>
          k === FormFieldNameMap.carCondition ||
          k === FormFieldNameMap.carBrand ||
          k === FormFieldNameMap.carModel ||
          k === FormFieldNameMap.carYear ||
          k === FormFieldNameMap.carCost ||
          k === FormFieldNameMap.carMileage,
      ),
    [errors],
  )

  const handleBtnClick = useCallback(() => {
    setFieldTouched(FormFieldNameMap.carCondition, true)
    setFieldTouched(FormFieldNameMap.carBrand, true)
    setFieldTouched(FormFieldNameMap.carModel, true)
    setFieldTouched(FormFieldNameMap.carYear, true)
    setFieldTouched(FormFieldNameMap.carCost, true)
    setFieldTouched(FormFieldNameMap.carMileage, true)
    setShouldChangeFillStatus(true)
  }, [setFieldTouched])

  useEffect(() => {
    if (!isFilled) {
      return
    }
    if (!hasErrors) {
      onFilled()
    }
    setFilled(false)
  }, [hasErrors, isFilled, onFilled])

  useEffect(() => {
    if (shouldChangeFillStatus) {
      setFilled(true)
      setShouldChangeFillStatus(false)
    }
  }, [shouldChangeFillStatus])

  const { vendorCode } = getPointOfSaleFromCookies()
  const { data } = useGetCarListQuery({ vendorCode })

  const [carBrandField] = useField(FormFieldNameMap.carBrand)
  const { setFieldValue } = useFormikContext()

  const prevCarBrandValue = usePrevious(carBrandField.value)

  const carBrands = useMemo(() => Object.keys(data?.cars || {}), [data?.cars])
  const carModels = useMemo(() => data?.cars?.[carBrandField.value] || [], [carBrandField.value, data?.cars])

  useEffect(() => {
    if (prevCarBrandValue !== carBrandField.value) {
      setFieldValue(FormFieldNameMap.carModel, null)
    }
  }, [carBrandField.value, prevCarBrandValue, setFieldValue])

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
          disabled={!carBrandField.value}
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
      </Box>
      <AreaFooter btnTitle="Рассчитать" onClickBtn={handleBtnClick} />
    </CollapsibleFormAreaContainer>
  )
}
