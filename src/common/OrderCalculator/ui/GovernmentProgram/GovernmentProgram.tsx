import { useCallback, useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { useFormikContext } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useSelectCreditProductList } from 'common/OrderCalculator/hooks/useSelectCreditProductList'
import {
  BriefOrderCalculatorFields,
  FormFieldNameMap,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'
import { maskOnlyDigitsWithSeparator, maskPercent } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { stringToNumber } from 'shared/utils/stringToNumber'

import useStyles from './GovernmentProgram.styles'

const calculateDiscount = (carCost: string, discountPercent = '', discountMax = '') => {
  const carCostNum = stringToNumber(carCost) || 0
  const discountPercentNum = stringToNumber(discountPercent) || 0
  const discountMaxNum = stringToNumber(discountMax)
  const carDiscount = carCostNum * (discountPercentNum / 100)

  // Если discountMax 0 или вообще не число, то считаем что нет ограничений по скидке
  if (!!discountMaxNum && carDiscount > discountMaxNum) {
    const newDiscountPercent = Math.round((discountMaxNum / carCostNum) * 10000) / 100

    return { discount: `${discountMaxNum}`, discountPercent: `${newDiscountPercent}` }
  }

  return { discount: `${carDiscount}`, discountPercent: `${discountPercentNum}` }
}

type GetProgramDiscountParams = {
  discount: string | undefined
  discountDfo: string | undefined
  discountMax: string | undefined
  isGovernmentProgram: boolean
  isDfoProgram: boolean
  carCost: string
}
const getProgramDiscount = ({
  discount,
  discountDfo,
  discountMax,
  isGovernmentProgram,
  isDfoProgram,
  carCost,
}: GetProgramDiscountParams) => {
  if (isGovernmentProgram && isDfoProgram) {
    return calculateDiscount(carCost, discountDfo, discountMax)
  }

  if (isGovernmentProgram && !isDfoProgram) {
    return calculateDiscount(carCost, discount, discountMax)
  }

  return { discount: '', discountPercent: '' }
}

type Props = {
  governmentPrograms: {
    value: string
    label: string
  }[]
  isDisabledChange?: boolean
}
export function GovernmentProgram({ governmentPrograms, isDisabledChange = false }: Props) {
  const classes = useStyles()
  const [isShouldValidate, setShouldValidate] = useState(false)

  const { values, setFieldValue, setFieldTouched, validateField, setSubmitting } = useFormikContext<
    FullOrderCalculatorFields | BriefOrderCalculatorFields
  >()
  const {
    isGovernmentProgram,
    isDfoProgram,
    carCost,
    governmentProgram,
    governmentName,
    governmentDiscount,
    governmentDiscountPercent,
    commonError,
  } = values

  const { creditProductListData, isCreditProductListSuccess } = useSelectCreditProductList()

  const currentGovernmentProgramCode =
    creditProductListData?.governmentProgramsMap[governmentProgram || '']?.code

  const handleGovernmentProgramChange = useCallback(
    (value: string | number) => {
      const currentGovernmentProgram = creditProductListData?.governmentProgramsMap[value || ''] || null
      const { discount, discountPercent } = getProgramDiscount({
        discount: currentGovernmentProgram?.discount,
        discountDfo: currentGovernmentProgram?.discountDfo,
        discountMax: currentGovernmentProgram?.discountMax,
        isGovernmentProgram,
        isDfoProgram,
        carCost,
      })

      if (governmentDiscount !== discount) {
        setFieldValue(FormFieldNameMap.GOVERNMENT_DISCOUNT, discount)
      }
      if (governmentDiscountPercent !== discountPercent) {
        setFieldValue(FormFieldNameMap.GOVERNMENT_DISCOUNT_PERCENT, discountPercent)
      }
      if (governmentName !== currentGovernmentProgram?.name) {
        setFieldValue(
          FormFieldNameMap.GOVERNMENT_NAME,
          currentGovernmentProgram?.name || initialValueMap.governmentName,
        )
      }
    },
    [
      carCost,
      creditProductListData?.governmentProgramsMap,
      governmentDiscount,
      governmentDiscountPercent,
      governmentName,
      isDfoProgram,
      isGovernmentProgram,
      setFieldValue,
    ],
  )

  /* Если Программы загружены, но currentGovernmentProgram?.code не найден,
  значит выбранная в форме госпрограмма не существует. Обнуляем значение в форме  */
  useEffect(() => {
    if (isCreditProductListSuccess && !currentGovernmentProgramCode && !!governmentProgram) {
      setFieldValue(FormFieldNameMap.GOVERNMENT_PROGRAM, initialValueMap.governmentProgram)
      setFieldValue(FormFieldNameMap.GOVERNMENT_DISCOUNT, initialValueMap.governmentDiscount)
      setFieldValue(FormFieldNameMap.GOVERNMENT_DISCOUNT_PERCENT, initialValueMap.governmentDiscountPercent)
      setFieldValue(FormFieldNameMap.GOVERNMENT_NAME, initialValueMap.governmentName)
      setFieldValue(FormFieldNameMap.commonError, { ...commonError, isCurrentGovProgramNotFoundInList: true })
      setShouldValidate(true)
    }
  }, [
    commonError,
    currentGovernmentProgramCode,
    governmentProgram,
    isCreditProductListSuccess,
    setFieldTouched,
    setFieldValue,
    setSubmitting,
    validateField,
  ])

  useEffect(() => {
    if (isShouldValidate) {
      setShouldValidate(false)
      setFieldTouched(FormFieldNameMap.GOVERNMENT_PROGRAM, true)
    }
  }, [isShouldValidate, setFieldTouched])

  // Если программа вновь выбрана, то очищаем ошибку
  useEffect(() => {
    if (governmentProgram && currentGovernmentProgramCode && commonError?.isCurrentGovProgramNotFoundInList) {
      setFieldTouched(FormFieldNameMap.GOVERNMENT_PROGRAM, false)
      setFieldValue(FormFieldNameMap.commonError, {
        ...commonError,
        isCurrentGovProgramNotFoundInList: false,
      })
    }
  }, [commonError, currentGovernmentProgramCode, governmentProgram, setFieldTouched, setFieldValue])

  return (
    <Box className={classes.gridContainer} gridColumn="1 / -1">
      <SelectInputFormik
        name={FormFieldNameMap.GOVERNMENT_PROGRAM}
        label="Тип программы"
        placeholder="-"
        options={governmentPrograms}
        gridColumn="span 2"
        emptyAvailable
        disabled={isDisabledChange}
        onChange={handleGovernmentProgramChange}
      />
      <MaskedInputFormik
        name={FormFieldNameMap.GOVERNMENT_DISCOUNT}
        label="Скидка в рублях"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 1"
        disabled
      />
      <MaskedInputFormik
        name={FormFieldNameMap.GOVERNMENT_DISCOUNT_PERCENT}
        label="Скидка в %"
        placeholder="-"
        mask={maskPercent}
        gridColumn="span 1"
        disabled
      />
    </Box>
  )
}
