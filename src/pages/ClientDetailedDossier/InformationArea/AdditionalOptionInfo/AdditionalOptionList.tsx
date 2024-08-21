import { useCallback, useState } from 'react'

import { Box, IconButton } from '@mui/material'

import { ReactComponent as KeyboardArrowDown } from 'assets/icons/keyboardArrowDown.svg'
import { ReactComponent as KeyboardArrowUp } from 'assets/icons/keyboardArrowUp.svg'
import { AreaContainer } from 'shared/ui/AreaContainer'
import SberTypography from 'shared/ui/SberTypography'

import { AdditionalOptionItem } from './AdditionalOptionItem'
import { useStyles } from './AdditionalOptionList.styles'

export interface AdditionalOptionInfo {
  name: string
  price: string
  creditStatus: string
}

type Props = {
  title: string
  options: AdditionalOptionInfo[]
}

export function AdditionalOptionList({ title, options }: Props) {
  const classes = useStyles()
  const [isShownOptions, setShowOptions] = useState(true)
  const changeShownOptions = useCallback(() => {
    setShowOptions(prev => !prev)
  }, [])

  return options.length ? (
    <AreaContainer>
      <Box className={classes.optionsWrapper}>
        <SberTypography sberautoVariant="body2" component="p" gridColumn="span 6">
          {title}
        </SberTypography>
        <Box width="100%" display="flex" justifyContent="end">
          <IconButton className={classes.optionsButton} onClick={changeShownOptions}>
            {isShownOptions ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>
        {isShownOptions && (
          <>
            {options.map((optionInfo, index) => (
              <AdditionalOptionItem
                key={optionInfo.name + index}
                name={optionInfo.name}
                price={optionInfo.price}
                creditStatus={optionInfo.creditStatus}
              />
            ))}
          </>
        )}
      </Box>
    </AreaContainer>
  ) : null
}
