import { useState } from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import cx from 'classnames'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { useLogout } from 'common/auth'
import { ChoosePoint } from 'entities/pointOfSale'
import { useGetUserQuery } from 'shared/api/requests/authdc'
import { sleep } from 'shared/lib/sleep'
import SberTypography from 'shared/ui/SberTypography'

import useStyles from './PointOfSaleAuth.styles'

const ANIMATION_DURATION = 1500

export function PointOfSaleAuth() {
  const classes = useStyles({ animationDuration: ANIMATION_DURATION })
  const [isEnabledClosingAnimation, setEnabledClosingAnimation] = useState(false)

  const { logout } = useLogout(async () => {
    setEnabledClosingAnimation(true)
    // время для выполнения анимации выхода
    await sleep(ANIMATION_DURATION - 500)
  })

  const { data } = useGetUserQuery()

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
        {data && (
          <SberTypography className={classes.formMessage} component="h1" sberautoVariant="body5">
            {`Привет, ${data.lastName} ${data.firstName}`}
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
