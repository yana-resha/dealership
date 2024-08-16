import { useCallback } from 'react'

import { AutocompleteRenderOptionState, Box } from '@mui/material'

import { Masked } from '../../masks/InputMasks'
import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { AutocompleteInput } from './AutocompleteInput'

type Props = {
  name: string
  label?: string
  placeholder: string
  options: string[]
  getOptionLabel?: (value: string) => string
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: string,
    state: AutocompleteRenderOptionState,
  ) => React.ReactNode
  gridColumn?: string
  emptyAvailable?: boolean
  isCustomValueAllowed?: boolean
  mask?: Masked
  disabled?: boolean
  onSelectOption?: (val: string | string[] | null) => void
  onChange?: (val: string | string[] | null) => void
}

export const AutocompleteInputFormik = ({
  name,
  label,
  options,
  getOptionLabel,
  renderOption,
  placeholder,
  gridColumn,
  isCustomValueAllowed,
  mask,
  disabled,
  onSelectOption,
  onChange: onChangeProp,
}: Props) => {
  const { value, isError, error, handleChange: onChange } = useFormikWrapper(name)

  const handleChange = useCallback(
    (value: string | string[] | null) => {
      onChange(value)
      onChangeProp?.(value)
    },
    [onChange, onChangeProp],
  )

  return (
    <Box gridColumn={gridColumn}>
      <AutocompleteInput
        label={label}
        placeholder={placeholder}
        options={options}
        // TODO Вместо функции поиска lebels добавить возможность делать опции
        // массивом объектов label,value, как в компоненте select.
        // В противном случае мы вынуждены для каждого айтема списка запускать getOptionLabel
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        disabled={disabled}
        id={name}
        value={value}
        onChange={handleChange}
        isError={isError}
        mask={mask}
        errorMessage={error}
        isCustomValueAllowed={isCustomValueAllowed}
        onSelectOption={onSelectOption}
      />
    </Box>
  )
}
