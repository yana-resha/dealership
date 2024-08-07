import { useEffect } from 'react'

import { Box } from '@mui/material'
import { useFormikContext } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { BriefOrderCalculatorFields, FormFieldNameMap } from 'common/OrderCalculator/types'
import { usePrevious } from 'shared/hooks/usePrevious'
import { AreaContainer } from 'shared/ui/AreaContainer'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './ProgramSwitchesArea.styles'

export function ProgramSwitchesArea() {
  const classes = useStyles()
  const {
    values: { isGovernmentProgram, isDfoProgram },
    setFieldValue,
  } = useFormikContext<BriefOrderCalculatorFields>()

  const prevIsGovernmentProgram = usePrevious(isGovernmentProgram)
  const prevIsDfoProgram = usePrevious(isDfoProgram)

  useEffect(() => {
    if (!isGovernmentProgram && isDfoProgram) {
      setFieldValue(FormFieldNameMap.IS_DFO_PROGRAM, false)
    }
  }, [setFieldValue, isDfoProgram, isGovernmentProgram])

  useEffect(() => {
    if (prevIsGovernmentProgram !== isGovernmentProgram || prevIsDfoProgram !== isDfoProgram) {
      setFieldValue(FormFieldNameMap.carBrand, initialValueMap.carBrand)
      setFieldValue(FormFieldNameMap.carModel, initialValueMap.carModel)
      setFieldValue(FormFieldNameMap.carYear, initialValueMap.carYear)
    }
  }, [isDfoProgram, isGovernmentProgram, prevIsDfoProgram, prevIsGovernmentProgram, setFieldValue])

  // очищаем значения госпрограммы при отключении программы
  useEffect(() => {
    if (!isGovernmentProgram) {
      setFieldValue(FormFieldNameMap.GOVERNMENT_PROGRAM, initialValueMap.governmentProgram)
      setFieldValue(FormFieldNameMap.GOVERNMENT_NAME, initialValueMap.governmentName)
      setFieldValue(FormFieldNameMap.GOVERNMENT_DISCOUNT, initialValueMap.governmentDiscount)
      setFieldValue(FormFieldNameMap.GOVERNMENT_DISCOUNT_PERCENT, initialValueMap.governmentDiscountPercent)
    }
  }, [isGovernmentProgram, setFieldValue])

  return (
    <AreaContainer>
      <Box className={classes.gridContainer}>
        <SwitchInputFormik
          gridColumn="span 1"
          name={FormFieldNameMap.IS_GOVERNMENT_PROGRAM}
          label="Госпрограмма"
        />
        <SwitchInputFormik
          gridColumn="span 1"
          name={FormFieldNameMap.IS_DFO_PROGRAM}
          label="ДФО"
          disabled={!isGovernmentProgram}
        />
      </Box>
    </AreaContainer>
  )
}
