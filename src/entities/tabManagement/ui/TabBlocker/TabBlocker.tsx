import React, { useEffect, useState } from 'react'

import { Box } from '@mui/material'

import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import SberTypography from 'shared/ui/SberTypography'

import { useTabManagement } from '../../hooks/useTabManagement'
import { slIsCurrentTabActive } from '../../model/selectors/slIsCurrentTabActive'
import useStyles from './TabBlocker.styles'

type Props = React.PropsWithChildren<{}>

const TabBlocker = (props: Props) => {
  const { children } = props
  const classes = useStyles()

  const [isBlock, setShowMyComp] = useState(false)

  useTabManagement()
  const isTabActive = useAppSelector(slIsCurrentTabActive)

  /** Задержка на отображение блокиратора, на случай задержки при востановления данных из локалСторадж */
  useEffect(() => {
    let timer: any

    if (!isTabActive) {
      timer = setTimeout(() => setShowMyComp(true), 1000)
    } else {
      setShowMyComp(false)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isTabActive])

  return (
    <>
      {children}

      {isBlock && (
        <Box className={classes.main}>
          <Box className={classes.box} data-testid="blockedMessageAboutTabDuplicate">
            <SberTypography className={classes.message} component="h2" sberautoVariant="h2">
              Приложение уже открыто в другом окне.
            </SberTypography>
            <SberTypography className={classes.message} component="h2" sberautoVariant="h2">
              Для продолжения работы вернитесь на другое окно.
            </SberTypography>
          </Box>
        </Box>
      )}
    </>
  )
}

export { TabBlocker }
