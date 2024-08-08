import { ForwardedRef, forwardRef } from 'react'

import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { SelectInput } from './SelectInput'
import { SelectInputProps } from './selectInput.types'

interface Props<T>
  extends Omit<SelectInputProps<T>, 'value' | 'onChange' | 'isError' | 'errorMessage' | 'id'> {
  name: string
  gridColumn?: string
}
export const SelectInputFormik = forwardRef(
  <T extends string | number>(
    { name, label, placeholder, options, gridColumn, emptyAvailable, disabled }: Props<T>,
    ref: ForwardedRef<HTMLDivElement | undefined>,
  ) => {
    const { value, isError, error, onChange } = useFormikWrapper(name)

    return (
      <Box width="auto" gridColumn={gridColumn} ref={ref}>
        <SelectInput
          label={label}
          placeholder={placeholder}
          options={options}
          emptyAvailable={emptyAvailable}
          disabled={disabled}
          id={name}
          value={value}
          onChange={onChange}
          isError={isError}
          errorMessage={error}
        />
      </Box>
    )
  },
)
