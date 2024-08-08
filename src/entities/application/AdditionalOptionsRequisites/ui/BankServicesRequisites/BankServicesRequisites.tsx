import { useEffect, useMemo } from 'react'

import { Box } from '@mui/material'
import { useFormikContext } from 'formik'

import { FULL_INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import {
  FormFieldNameMap,
  FullInitialBankAdditionalService,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'
import { checkIsNumber, getTaxFromPercent } from 'shared/lib/helpers'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { ServicesGroupName } from '../../configs/additionalOptionsRequisites.config'
import { useRequisitesContext } from '../RequisitesContext'
import { useStyles } from './BankServicesRequisites.styles'

type Props = {
  index: number
  parentName: ServicesGroupName
  servicesItem: FullInitialBankAdditionalService
}

export function BankServicesRequisites({
  index,
  parentName,

  servicesItem,
}: Props) {
  const classes = useStyles()

  const { setFieldValue } = useFormikContext<FullOrderCalculatorFields>()
  const { productType, provider, productCost } = servicesItem
  const { requisites, isRequisitesFetched } = useRequisitesContext()
  const namePrefix = `${parentName}[${index}].`

  const optionRequisite = useMemo(
    () => requisites?.bankOptionsMap?.[productType ?? ''],
    [requisites?.bankOptionsMap, productType],
  )

  const providerOptions = useMemo(
    () =>
      (optionRequisite?.providerBrokers || []).map(v => ({
        value: v.providerCode,
        label: v.providerName,
      })),
    [optionRequisite?.providerBrokers],
  )

  const currentProvider = useMemo(
    () => optionRequisite?.providerBrokersMap[provider || ''],
    [optionRequisite?.providerBrokersMap, provider],
  )

  useEffect(() => {
    if (isRequisitesFetched) {
      setFieldValue(
        namePrefix + FormFieldNameMap.provider,
        currentProvider?.providerCode ?? FULL_INITIAL_BANK_ADDITIONAL_SERVICE.provider,
      )
    }
  }, [currentProvider?.providerCode, isRequisitesFetched, namePrefix, setFieldValue])

  useEffect(() => {
    if (currentProvider) {
      const tax = currentProvider.brokers[0]?.tax
      setFieldValue(namePrefix + FormFieldNameMap.providerName, currentProvider.providerName)
      setFieldValue(namePrefix + FormFieldNameMap.broker, currentProvider.brokers[0]?.brokerCode)
      setFieldValue(namePrefix + FormFieldNameMap.brokerName, currentProvider.brokers[0]?.brokerName)
      setFieldValue(namePrefix + FormFieldNameMap.taxPercent, tax)
      const productCostNum = stringToNumber(productCost)
      setFieldValue(
        namePrefix + FormFieldNameMap.taxValue,
        checkIsNumber(tax) && checkIsNumber(productCostNum)
          ? getTaxFromPercent(productCostNum, tax)
          : undefined,
      )

      setFieldValue(
        namePrefix + FormFieldNameMap.bankAccountNumber,
        currentProvider.brokers[0]?.requisites[0]?.accounts?.[0],
      )
      setFieldValue(
        namePrefix + FormFieldNameMap.correspondentAccount,
        currentProvider.brokers[0]?.requisites[0]?.accountCorrNumber,
      )
      setFieldValue(
        namePrefix + FormFieldNameMap.beneficiaryBank,
        currentProvider.brokers[0]?.requisites[0]?.bankName,
      )
      setFieldValue(
        namePrefix + FormFieldNameMap.bankIdentificationCode,
        currentProvider.brokers[0]?.requisites[0]?.bik,
      )
      setFieldValue(namePrefix + FormFieldNameMap.inn, currentProvider.brokers[0]?.inn)
      setFieldValue(namePrefix + FormFieldNameMap.ogrn, currentProvider.brokers[0]?.ogrn)
      setFieldValue(namePrefix + FormFieldNameMap.kpp, currentProvider.brokers[0]?.kpp)
    }
  }, [currentProvider, namePrefix, productCost, provider, setFieldValue])

  return (
    <Box gridColumn="1/-1" className={classes.requisitesContainer}>
      <SelectInputFormik
        name={namePrefix + FormFieldNameMap.provider}
        label="Страховая компания или поставщик"
        placeholder="-"
        options={providerOptions}
        gridColumn="span 6"
      />
    </Box>
  )
}
