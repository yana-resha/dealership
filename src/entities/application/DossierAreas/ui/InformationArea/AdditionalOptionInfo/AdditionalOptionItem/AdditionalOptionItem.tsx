import { Box } from '@mui/material'

import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './AdditionalOptionItem.styles'

type Props = {
  name: string
  price: string
  creditStatus: string
}

export function AdditionalOptionItem({ name, price, creditStatus }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.additionalOptionItem}>
      <SberTypography sberautoVariant="body3" component="p" gridColumn="span 2" minWidth="min-content">
        {name}
      </SberTypography>
      <SberTypography sberautoVariant="body3" component="p" gridColumn="span 1" minWidth="min-content">
        {price}
      </SberTypography>
      <SberTypography sberautoVariant="body3" component="p" gridColumn="span 4" minWidth="min-content">
        {creditStatus}
      </SberTypography>
    </Box>
  )
}
