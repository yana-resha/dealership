import { createTheme, alpha } from '@mui/material'
import { Theme } from '@mui/material/styles'

import {
  BLACK,
  DARK_GRAY,
  DARK_NORMAL,
  GRAY_NORMAL,
  LIGHT_GRAY,
  PRIMARY_DARK,
  PRIMARY_MAIN,
  WHITE,
} from './palette'

// NOTE: Since makeStyles is now exported from @mui/styles package which does not know about
// Theme in the core package. To fix this, you need to augment the DefaultTheme (empty object)
// in @mui/styles with Theme from the core.

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1400,
    },
  },
  typography: {
    fontFamily: '"SBSansText", Arial',
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 0,
          width: '42px',
          height: '26px',
        },
        thumb: {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        track: {
          height: '26px',
          borderRadius: '16px',
          backgroundColor: GRAY_NORMAL,
          opacity: 1,
        },
        switchBase: {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: 'WHITE',
            '& + .MuiSwitch-track': {
              backgroundColor: '#17A131',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            border: '6px solid WHITE',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color: '#ffffff',
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
          boxShadow: `0px 2px 4px ${alpha(BLACK, 0.1)}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: `${alpha(PRIMARY_MAIN, 0.1)}`,
          },
          '&.Mui-selected': {
            backgroundColor: '#fff0',
            '&:hover': {
              backgroundColor: `${alpha(PRIMARY_MAIN, 0.1)}`,
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          padding: '8px 16px',
          minWidth: 'min-content',
          fontSize: 16,
          fontWeight: 400,
          textTransform: 'initial',
          lineHeight: '16px',
          letterSpacing: 'normal',
        },
        text: {
          padding: 0,
        },
        contained: {
          boxShadow: 'none',
          borderRadius: 48,

          '&:disabled': {
            backgroundColor: LIGHT_GRAY,
            color: alpha(BLACK, 0.38),
          },
        },
        outlined: {
          boxShadow: 'none',
          borderRadius: 48,

          '&:disabled': {
            backgroundColor: LIGHT_GRAY,
            color: alpha(BLACK, 0.38),
          },
        },
        containedPrimary: {
          backgroundColor: PRIMARY_MAIN,

          '&:hover': {
            backgroundColor: PRIMARY_DARK,
            boxShadow: `0 2px 4px 0 ${alpha(PRIMARY_MAIN, 0.2)}`,
          },
          '&:active': {
            backgroundColor: PRIMARY_DARK,
          },
        },
        containedSecondary: {
          color: WHITE,
        },
        containedSizeSmall: {
          padding: '7px 16px',
          fontSize: 12,
          height: 32,
        },
        containedSizeMedium: {
          padding: '10px 24px',
          fontSize: 14,
          height: 40,
        },
        containedSizeLarge: {
          padding: '14px 32px',
          fontSize: 16,
          height: 48,
        },
      },
    },
  },
  palette: {
    status: {
      initial: '#0B6B9D',
      processed: '#FF971E',
      approved: '#17A131',
      rejected: '#904d30',
      canceled: '#D3D3D3',
      error: '#D32f2f',
    },
    sber: {
      main: '#17A131',
      dark: '#1d9032',
    },
    primary: {
      main: PRIMARY_MAIN,
      dark: PRIMARY_DARK,
    },
    background: {
      paper: '#F4F4F9',
      default: '#fff',
    },
    text: {
      primary: DARK_NORMAL,
      secondary: GRAY_NORMAL,
      disabled: alpha(BLACK, 0.26),
    },
    colors: {
      blueGray: '#ECF1FA',
      white: WHITE,
    },
    icon: {
      main: DARK_GRAY,
    },
  },
})

/** Добавляем новые наборы цветов в палитру темы */
declare module '@mui/material/styles' {
  interface Palette {
    sber: Palette['primary']
    colors: Palette['primary']
    status: Palette['primary']
    icon: Palette['primary']
  }

  interface PaletteOptions {
    sber: {
      main: React.CSSProperties['color']
      dark: React.CSSProperties['color']
    }
    colors: {
      blueGray: React.CSSProperties['color']
      white: React.CSSProperties['color']
    }

    status: {
      initial: React.CSSProperties['color']
      processed: React.CSSProperties['color']
      approved: React.CSSProperties['color']
      rejected: React.CSSProperties['color']
      canceled: React.CSSProperties['color']
      error: React.CSSProperties['color']
    }

    icon: {
      main: React.CSSProperties['color']
    }
  }

  interface PaletteColor {
    main: string
    dark: string
    blueGray: string
    white: string
    draft: string
    refused: string
    manual: string
    initial: string
    processed: string
    approved: string
    rejected: string
    canceled: string
    error: string
  }

  interface SimplePaletteColorOptions {
    main: string
    dark?: string
    initial?: string
    processed?: string
    approved?: string
    rejected?: string
    canceled?: string
    error?: string
  }
}
