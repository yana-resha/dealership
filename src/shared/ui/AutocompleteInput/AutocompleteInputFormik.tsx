import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { AutocompleteInput } from './AutocompleteInput'

type Props = {
  name: string
  label: string
  placeholder: string
  options: string[]
  gridColumn?: string
  emptyAvailable?: boolean
  disabled?: boolean
}

export const AutocompleteInputFormik = ({
  name,
  label,
  options,
  placeholder,
  gridColumn,
  disabled,
}: Props) => {
  const { value, isError, error, onChange } = useFormikWrapper(name)

  return (
    <Box gridColumn={gridColumn}>
      <AutocompleteInput
        label={label}
        placeholder={placeholder}
        options={options}
        disabled={disabled}
        id={name}
        value={value}
        onChange={onChange}
        isError={isError}
        errorMessage={error}
      />
    </Box>
  )
}
