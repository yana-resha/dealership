import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { DateInput } from './DateInput'

type Props = {
  name: string
  label: string
  gridColumn?: string
  disabled?: boolean
}

export const DateInputFormik = (props: Props) => {
  const { name, label, gridColumn, disabled } = props
  const { value, isError, error, onChange } = useFormikWrapper(name)

  return (
    <Box width="auto" minWidth="min-content" gridColumn={gridColumn}>
      <DateInput
        label={label}
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
