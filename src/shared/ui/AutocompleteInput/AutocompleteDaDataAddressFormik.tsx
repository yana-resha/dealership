import React, { useCallback } from 'react'

import { Box } from '@mui/material'
import { DataGetAddressSuggestions, SuggestionGetAddressSuggestions } from '@sberauto/dadata-proto/public'
import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { useFormikContext } from 'formik'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { AutocompleteDaDataAddress } from './AutocompleteDaDataAddress'

type Props = {
  nameOfString: string
  nameOfObject: string
  label: string
  placeholder: string
  id?: string
  gridColumn?: string
  disabled?: boolean
  forceValue?: SuggestionGetAddressSuggestions
}

export const AutocompleteDaDataAddressFormik = ({
  nameOfString,
  nameOfObject,
  label,
  placeholder,
  gridColumn,
  disabled,
  forceValue,
}: Props) => {
  const { value: valueString, isError, error } = useFormikWrapper(nameOfString)
  const { value: valueObject } = useFormikWrapper(nameOfObject)
  const addressSuggestion: SuggestionGetAddressSuggestions = {
    value: valueString,
    unrestrictedValue: valueString,
    data: valueObject as DataGetAddressSuggestions,
  }
  const { setFieldValue } = useFormikContext()

  const mapAddressToModel = useCallback((addressObject: SuggestionGetAddressSuggestions): AddressFrontdc => {
    const data = addressObject?.data
    const address: AddressFrontdc = {
      postalCode: data?.postalCode ?? '',
      regCode: data?.regionKladrId ? data.regionKladrId.slice(0, 2) : '',
      area: data?.area ?? '',
      areaType: data?.areaTypeFull ?? '',
      city: data?.city ?? '',
      cityType: data?.cityTypeFull ?? '',
      house: data?.house ?? '',
      houseExt: data?.block ?? '',
      region: data?.region ?? '',
      settlement: data?.settlement ?? '',
      settlementType: data?.settlementTypeFull ?? '',
      street: data?.street ?? '',
      streetType: data?.streetTypeFull ?? '',
      unit: '',
      unitNum: data?.flat ?? '',
    }

    return address
  }, [])

  const onChange = useCallback(
    (values: SuggestionGetAddressSuggestions) => {
      setFieldValue(nameOfObject, mapAddressToModel(values))
      setFieldValue(nameOfString, values?.unrestrictedValue ?? '')
    },
    [mapAddressToModel, nameOfObject, nameOfString, setFieldValue],
  )

  const onInputChange = useCallback(() => {
    setFieldValue(nameOfObject, { unrestrictedValue: '' })
    setFieldValue(nameOfString, '')
  }, [nameOfObject, nameOfString, setFieldValue])

  return (
    <Box gridColumn={gridColumn}>
      <AutocompleteDaDataAddress
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        id={nameOfString}
        value={addressSuggestion}
        onChange={onChange}
        onInputChange={onInputChange}
        isError={isError}
        errorMessage={error}
        forceValue={forceValue}
      />
    </Box>
  )
}
