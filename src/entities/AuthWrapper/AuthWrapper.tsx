import { useRef } from 'react'

import { Box } from '@mui/material'

import { ReactComponent as MonochromeSberIcon } from 'assets/icons/monochromeSberIcon.svg'
import { ReactComponent as SberLogoTitle } from 'assets/icons/sberLogoTitle.svg'

import { useStyles } from './AuthWrapper.styles'

type AuthWrapperProps = {
  dataTestId: string
}

export const AuthWrapper = ({ dataTestId, children }: React.PropsWithChildren<AuthWrapperProps>) => {
  const classes = useStyles()
  const imgRef = useRef<HTMLImageElement>(null)

  const handleImgLoaded = () => {
    if (imgRef.current) {
      imgRef.current.classList.add(classes.loadedImg)
    }
  }

  return (
    <Box className={classes.container} data-testid={dataTestId}>
      <Box className={classes.coverArt}>
        <Box className={classes.logo}>
          <MonochromeSberIcon className={classes.logoIcon} />
          <SberLogoTitle className={classes.logoTitle} />
        </Box>
        <Box className={classes.imgContainer}>
          <img
            src="images/coverArt.webp"
            alt="Изображение автомобиля"
            className={classes.img}
            onLoad={handleImgLoaded}
            ref={imgRef}
          />
        </Box>
      </Box>

      <Box className={classes.childrenContainer}>
        <MonochromeSberIcon className={classes.logoImgBackground} />
        {children}
      </Box>
    </Box>
  )
}
