import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material'

import { ReactComponent as CheckedRadio } from 'assets/icons/checkedRadio.svg'
import { ReactComponent as UncheckedRadio } from 'assets/icons/uncheckedRadio.svg'

import { theme } from '../../../app/theme'
import { useStyles } from './RadioGroupInput.styles'

type RadioValue = {
  radioValue: number | boolean | string
  radioLabel: string
}

type Props = {
  radioValues: RadioValue[]
  defaultValue: any
  onChange: (value: any) => void
  centered?: boolean
  gridColumn?: string
}

export const RadioGroupInput = (props: Props) => {
  const classes = useStyles()
  const { radioValues, defaultValue, onChange, centered, gridColumn } = props

  return (
    <Box minWidth="max-content" marginTop={centered ? theme.spacing(3.5) : '0'} gridColumn={gridColumn}>
      <RadioGroup row className={classes.radioContainer} defaultValue={defaultValue}>
        {radioValues.map(radio => (
          <FormControlLabel
            key={`${radio.radioValue}${radio.radioLabel}`}
            value={radio.radioValue}
            control={<Radio disableRipple icon={<UncheckedRadio />} checkedIcon={<CheckedRadio />} />}
            label={radio.radioLabel}
            onChange={() => onChange(radio.radioValue)}
          />
        ))}
      </RadioGroup>
    </Box>
  )
}
