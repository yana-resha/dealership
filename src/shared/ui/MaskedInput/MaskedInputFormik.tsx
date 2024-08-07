import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { MaskedInput } from './MaskedInput'
import { MaskedInputProps } from './maskedInput.types'

interface Props extends Omit<MaskedInputProps, 'onChange' | 'isError' | 'value'> {
  name: string
  gridColumn?: string
}

export const MaskedInputFormik = (props: Props) => {
  const { name, label, placeholder, mask, gridColumn, disabled, InputProps, helperMessage } = props
  const { value, isError, error, handleChange } = useFormikWrapper(name)

  return (
    <Box width="auto" gridColumn={gridColumn}>
      <MaskedInput
        label={label}
        placeholder={placeholder}
        mask={mask}
        disabled={disabled}
        id={name}
        value={value}
        onChange={handleChange}
        isError={isError}
        errorMessage={error}
        InputProps={InputProps}
        helperMessage={helperMessage}
      />
    </Box>
  )
}
