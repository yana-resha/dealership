import { Box } from '@mui/material'

import { Masked } from '../../masks/InputMasks'
import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { AutocompleteInput } from './AutocompleteInput'

type Props = {
  name: string
  label: string
  placeholder: string
  options: string[]
  getOptionLabel?: (value: string) => string
  gridColumn?: string
  emptyAvailable?: boolean
  isCustomValueAllowed?: boolean
  mask?: Masked
  disabled?: boolean
  onSelectOption?: (val: string | string[] | null) => void
}

export const AutocompleteInputFormik = ({
  name,
  label,
  options,
  getOptionLabel,
  placeholder,
  gridColumn,
  isCustomValueAllowed,
  mask,
  disabled,
  onSelectOption,
}: Props) => {
  const { value, isError, error, onChange } = useFormikWrapper(name)

  return (
    <Box gridColumn={gridColumn}>
      <AutocompleteInput
        label={label}
        placeholder={placeholder}
        options={options}
        getOptionLabel={getOptionLabel}
        disabled={disabled}
        id={name}
        value={value}
        onChange={onChange}
        isError={isError}
        mask={mask}
        errorMessage={error}
        isCustomValueAllowed={isCustomValueAllowed}
        onSelectOption={onSelectOption}
      />
    </Box>
  )
}
