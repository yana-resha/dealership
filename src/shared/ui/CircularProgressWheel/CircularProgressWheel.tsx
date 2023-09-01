import { Box } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

import { theme } from 'app/theme'
import { ReactComponent as LoadingWheel } from 'assets/icons/loadingWheel.svg'

type StyleProps = {
  color: string
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },

  rotateImage: {
    animation: '$rotate 1.5s linear infinite',
  },

  imageColor: props => ({
    '& path': {
      fill: props.color,
    },
  }),
}))

type Props = {
  size?: string
  color?: string
}

enum WheelSize {
  small = 30,
  medium = 36,
  large = 40,
  extraLarge = 64,
}

export const CircularProgressWheel = ({ size = 'small', color = theme.palette.text.primary }: Props) => {
  const classes = useStyles({ color })

  return (
    <Box display="flex" alignItems="center" data-testid="circularProgressWheel">
      <LoadingWheel
        className={`${classes.rotateImage} ${classes.imageColor}`}
        height={WheelSize[size as keyof typeof WheelSize]}
        width={WheelSize[size as keyof typeof WheelSize]}
      />
    </Box>
  )
}
