import { useState } from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import cx from 'classnames'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { useLogout } from 'common/auth'
import { ChoosePoint } from 'entities/pointOfSale'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { sleep } from 'shared/lib/sleep'
import SberTypography from 'shared/ui/SberTypography'

import useStyles from './PointOfSaleAuth.styles'

const ANIMATION_DURATION = 1500

export function PointOfSaleAuth() {
  const classes = useStyles({ animationDuration: ANIMATION_DURATION })
  const [isEnabledClosingAnimation, setEnabledClosingAnimation] = useState(false)
  const user = useAppSelector(state => state.user.user)

  const { logout } = useLogout(async () => {
    setEnabledClosingAnimation(true)
    // время для выполнения анимации выхода
    await sleep(ANIMATION_DURATION - 500)
  })

  return (
    <Box
      className={cx(classes.pointOfSaleFormContainer, {
        [classes.closingAnimation]: isEnabledClosingAnimation,
        [classes.closedPointOfSaleFormContainer]: isEnabledClosingAnimation,
      })}
    >
      <IconButton className={classes.backArrow} onClick={() => logout()} data-testid="backButton">
        <KeyboardArrowLeft />
      </IconButton>

      <Box className={classes.greetingContainer}>
        {user && (
          <SberTypography className={classes.formMessage} component="h1" sberautoVariant="body5">
            {`Привет, ${user.lastName} ${user.firstName}`}
          </SberTypography>
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
