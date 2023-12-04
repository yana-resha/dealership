import { Box } from '@mui/material'

import { ReactComponent as ConfirmationDocumentIcon } from 'assets/icons/confirmationDocument.svg'
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip'

import useStyles from './ButtonsCell.styles'

export function ButtonsCell() {
  const classes = useStyles()

  return (
    <Box className={classes.btnContainer}>
      <CustomTooltip
        arrow
        title={<span style={{ maxWidth: 150 }}>Требуется справка подтверждающая доход</span>}
      >
        <ConfirmationDocumentIcon className={classes.icon} />
      </CustomTooltip>
    </Box>
  )
}
