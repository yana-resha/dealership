/* eslint-disable no-constant-condition */
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { useLogout } from 'common/auth'
import { ChoosePoint } from 'entities/pointOfSale'
import { useGetUserQuery } from 'shared/api/requests/authdc'
import SberTypography from 'shared/ui/SberTypography'

import useStyles from './PointOfSaleAuth.styles'

export function PointOfSaleAuth() {
  const classes = useStyles()

  const { onLogout } = useLogout()

  const { data } = useGetUserQuery()

  return (
    <Box className={classes.pointOfSaleFormContainer}>
      <IconButton className={classes.backArrow} onClick={onLogout} data-testid="backButton">
        <KeyboardArrowLeft />
      </IconButton>

      {data ? (
        <Typography className={classes.formMessage}>
          {`Привет, ${data?.lastName} ${data?.firstName}`}
        </Typography>
      ) : (
        <Skeleton variant="text" sx={{ fontSize: 19 }} width={210} />
      )}

      <Box className={classes.autocompleteContainer}>
        <SberTypography sberautoVariant="body5" component="p" className={classes.subtitle} align="left">
          Выберите автосалон
        </SberTypography>

        <ChoosePoint />
      </Box>
    </Box>
  )
}
