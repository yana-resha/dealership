import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { AdornmentInput } from './AdornmentInput'
import { AdornmentInputProps } from './adornmentInput.types'

interface Props extends Omit<AdornmentInputProps, 'onChange' | 'isError' | 'value'> {
  name: string
  gridColumn?: string
}

export const AdornmentInputFormik = (props: Props) => {
  const {
    name,
    label,
    placeholder,
    mask,
    gridColumn,
    disabled,
    inputProps,
    helperMessage,
    type,
    endAdornment,
  } = props
  const { value, isError, error, handleChange } = useFormikWrapper(name)

  return (
    <Box width="auto" gridColumn={gridColumn}>
      <AdornmentInput
        label={label}
        placeholder={placeholder}
        mask={mask}
        disabled={disabled}
        id={name}
        value={value}
        onChange={handleChange}
        isError={isError}
        errorMessage={error}
        inputProps={inputProps}
        helperMessage={helperMessage}
        type={type}
        endAdornment={endAdornment}
      />
    </Box>
  )
}
