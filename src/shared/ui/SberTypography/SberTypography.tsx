import React, { useMemo, useCallback } from 'react'

import { Typography, useMediaQuery, useTheme } from '@mui/material'
import { withStyles } from '@mui/styles'
import cx from 'classnames'

import { SberTypographyProps, SberautoVariant } from './SberTypography.interface'

const SBSansDisplayFont = 'SBSansDisplay, OpenSans, "Helvetica Neue", Helvetica, Arial, sans-serif'

const style = (): any => ({
  h0: {
    //H0 SB Sans Display Bold 58 line 74
    fontFamily: SBSansDisplayFont,
    fontSize: 58,
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textTransform: 'none',
  },
  h1: {
    //H1 SB Sans Display Regular 40 line 50
    fontFamily: SBSansDisplayFont,
    fontSize: 40,
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.25,
    letterSpacing: 'normal',
  },
  h2: {
    //H2 SB Sans Display Bold 32 line 44
    fontFamily: SBSansDisplayFont,
    fontSize: 32,
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.38,
    letterSpacing: 'normal',
  },
  h3: {
    //H3 SB Sans Display Regular 32 line 44
    fontFamily: SBSansDisplayFont,
    fontSize: 32,
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.38,
    letterSpacing: 'normal',
  },
  h4: {
    //H4 SB Sans Display 25 Bold line 32
    fontFamily: SBSansDisplayFont,
    fontSize: 25,
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  h5: {
    //H5 SB Sans Display Semibold 25 line 32
    fontFamily: SBSansDisplayFont,
    fontSize: 25,
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  h6: {
    //H6 SB Sans Text Semibold 19 line 24
    fontSize: 19,
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body1: {
    //Body1 SB Sans Text Regular 19 line 24
    fontSize: 19,
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body2: {
    //Body2 SB Sans Text Semobold 16 line 20
    fontSize: 16,
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body3: {
    //Body3 SB Sans Text Regular 16 line 20/24
    fontSize: 16,
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body4: {
    //Body4 SB Sans Text Semibold 14 line 18
    fontSize: 14,
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  body5: {
    //Body5 SB Sans Text Regular 14 line 18/20
    fontSize: 14,
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textTransform: 'none',
  },
  body6: {
    //Body6 SB Sans Text Regular 11 line 14
    fontSize: 11,
    fontWeight: 400,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#9ca8b4',
  },
})

/**
 * Переписывает дефолтный material UI typography с дополнительными variant
 */
const SberTypography = ({
  variant,
  sberautoVariant,
  sberautoMobileVariant,
  classes,
  className,
  ...props
}: SberTypographyProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const calcVariant = useCallback(
    (anyVariant?: SberautoVariant) => {
      const isCustom = anyVariant && classes ? Object.keys(classes).indexOf(anyVariant) > -1 : false

      const customClass = (classes as any)[anyVariant || '']
      const customClassName = isCustom && anyVariant ? cx(customClass, className) : className

      return { variant: isCustom ? undefined : variant, customClassName }
    },
    [className, classes, variant],
  )

  const customVariant = useMemo(
    () => calcVariant(isMobile && sberautoMobileVariant ? sberautoMobileVariant : sberautoVariant),
    [calcVariant, isMobile, sberautoMobileVariant, sberautoVariant],
  )

  return <Typography {...props} className={customVariant.customClassName} variant={customVariant.variant} />
}

export default withStyles(style)(SberTypography)
