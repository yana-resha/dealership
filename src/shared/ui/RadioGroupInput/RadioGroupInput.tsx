import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

import { ReactComponent as CheckedRadio } from 'assets/icons/checkedRadio.svg'
import { ReactComponent as UncheckedRadio } from 'assets/icons/uncheckedRadio.svg'

import { useStyles } from './RadioGroupInput.styles'

type RadioValue = {
  radioValue: number | boolean | string
  radioLabel: string
}

type Props = {
  radioValues: RadioValue[]
  defaultValue: any
  onChange: (value: any) => void
}

export const RadioGroupInput = (props: Props) => {
  const classes = useStyles()
  const { radioValues, defaultValue, onChange } = props

  return (
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
  )
}
