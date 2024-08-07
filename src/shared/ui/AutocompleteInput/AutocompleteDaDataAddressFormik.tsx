import { useCallback } from 'react'

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
  prepareAddress: (addressObjectData: DataGetAddressSuggestions | null | undefined) => AddressFrontdc
}

export const AutocompleteDaDataAddressFormik = ({
  nameOfString,
  nameOfObject,
  label,
  placeholder,
  gridColumn,
  disabled,
  forceValue,
  prepareAddress,
}: Props) => {
  const { value: valueString, isError, error } = useFormikWrapper(nameOfString)
  const { value: valueObject } = useFormikWrapper(nameOfObject)
  const addressSuggestion: SuggestionGetAddressSuggestions = {
    value: valueString,
    unrestrictedValue: valueString,
    data: valueObject as DataGetAddressSuggestions,
  }
  const { setFieldValue } = useFormikContext()

  const onChange = useCallback(
    (values: SuggestionGetAddressSuggestions | null) => {
      setFieldValue(nameOfObject, prepareAddress(values?.data))
      setFieldValue(nameOfString, values?.unrestrictedValue ?? '')
    },
    [nameOfObject, nameOfString, prepareAddress, setFieldValue],
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
