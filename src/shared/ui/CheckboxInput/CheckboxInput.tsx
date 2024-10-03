import { Box, Checkbox } from '@mui/material'

import SberTypography from '../SberTypography'
import useStyles from './CheckboxInput.styles'

type CheckboxInputProps = {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent, checked: boolean) => void
}

export const CheckboxInput = (props: CheckboxInputProps) => {
  const classes = useStyles()

  return (
    <Box className={classes.main}>
      <Checkbox
        size="small"
        checked={props.checked}
        onChange={props.onChange}
        inputProps={{ 'aria-label': 'controlled' }}
        className={classes.checkbox}
      />
      <SberTypography sberautoVariant="body5" component="span">
        {props.label}
      </SberTypography>
    </Box>
  )
}
