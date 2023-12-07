import Box from '@mui/material/Box'

import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { Downloader } from 'shared/ui/Downloader'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from '../InformationArea.styles'

type Props = {
  onClick: () => Promise<File | undefined>
  disabled: boolean
}

export function FeeScheduleBtn({ onClick, disabled }: Props) {
  const classes = useStyles()

  return (
    <Downloader onDownloadFile={onClick} gridColumn="span 2" disabled={disabled}>
      <Box className={classes.textButtonContainer}>
        <ScheduleIcon />
        <SberTypography sberautoVariant="body3" component="p">
          График платежей
        </SberTypography>
      </Box>
    </Downloader>
  )
}
