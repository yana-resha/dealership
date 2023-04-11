import { createTheme, alpha } from '@mui/material'
import { Theme } from '@mui/material/styles'

import { BLACK, DARK_NORMAL, GRAY_NORMAL, LIGHT_GRAY, PRIMARY_DARK, PRIMARY_MAIN, WHITE } from './palette'

// NOTE: Since makeStyles is now exported from @mui/styles package which does not know about
// Theme in the core package. To fix this, you need to augment the DefaultTheme (empty object)
// in @mui/styles with Theme from the core.

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

export const theme = createTheme({
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
        containedPrimary: {
          backgroundColor: PRIMARY_MAIN,

          '&:hover': {
            backgroundColor: PRIMARY_MAIN,
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
    sber: {
      main: '#17A131',
      dark: '#1d9032',
    },
    primary: {
      main: PRIMARY_MAIN,
    },
    background: {
      paper: '#F4F4F9',
      default: '#fff',
    },
    text: {
      primary: DARK_NORMAL,
      secondary: GRAY_NORMAL,
    },
  },
})

/** Добавляем новые наборы цветов в палитру темы */
declare module '@mui/material/styles' {
  interface Palette {
    sber: Palette['primary']
  }

  interface PaletteOptions {
    sber: {
      main: React.CSSProperties['color']
      dark: React.CSSProperties['color']
    }
  }

  interface PaletteColor {
    main: string
    dark: string
  }

  interface SimplePaletteColorOptions {
    main: string
    dark?: string
  }
}
