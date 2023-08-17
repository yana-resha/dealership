import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import cx from 'classnames'

import { ReactComponent as Car } from 'assets/icons/car.svg'
import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { useLogout } from 'common/auth'
import { ChoosePoint } from 'entities/pointOfSale'
import { useGetUserQuery } from 'shared/api/requests/authdc'
import SberTypography from 'shared/ui/SberTypography'

import useStyles from './PointOfSaleAuth.styles'

const ANIMATION_DURATION = 1500

export function PointOfSaleAuth() {
  const classes = useStyles({ animationDuration: ANIMATION_DURATION })
  const [isAllowedAnimation, setAllowedAnimation] = useState(true)

  const { onLogout } = useLogout()

  const { data } = useGetUserQuery()

  useEffect(() => {
    if (data && isAllowedAnimation) {
      setTimeout(() => setAllowedAnimation(false), ANIMATION_DURATION)
    }
  }, [data, isAllowedAnimation])

  return (
    <Box className={classes.pointOfSaleFormContainer}>
      <IconButton className={classes.backArrow} onClick={() => onLogout()} data-testid="backButton">
        <KeyboardArrowLeft />
      </IconButton>

      <Box className={classes.greetingContainer}>
        {data && (
          <>
            <Box className={classes.imgContainer}>
              <Car className={cx(classes.carImg, { [classes.animationCarImg]: isAllowedAnimation })} />
            </Box>
            <Box className={classes.greetingTextContainer}>
              <Typography
                className={cx(classes.formMessage, { [classes.animationFormMessage]: isAllowedAnimation })}
              >
                {`👋 Привет, ${data?.lastName} ${data?.firstName}`}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <Box className={classes.autocompleteContainer}>
        <SberTypography sberautoVariant="body5" component="p" className={classes.subtitle} align="left">
          Выберите автосалон
        </SberTypography>

        <ChoosePoint />
      </Box>
    </Box>
  )
}
