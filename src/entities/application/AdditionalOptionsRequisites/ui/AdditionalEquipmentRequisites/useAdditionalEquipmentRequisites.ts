import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { FULL_INITIAL_ADDITIONAL_EQUIPMENTS } from 'common/OrderCalculator/config'
import { FormFieldNameMap, FullOrderCalculatorFields } from 'common/OrderCalculator/types'

import { RequisitesForFinancing } from '../../hooks/useRequisitesForFinancingQuery'

type Params = {
  isCustomFields: boolean
  isRequisitesFetched: boolean
  namePrefix: string
  requisites: RequisitesForFinancing | undefined
  productType: number | null
  broker: number | null
  beneficiaryBank: string
  productCost: string
  isCredit: boolean
}
export function useAdditionalEquipmentRequisites({
  isCustomFields,
  isRequisitesFetched,
  namePrefix,
  beneficiaryBank,
  productType,
  requisites,
  broker,
  productCost,
  isCredit,
}: Params) {
  const { setFieldValue } = useFormikContext<FullOrderCalculatorFields>()

  const optionRequisite = useMemo(
    () => requisites?.additionalEquipmentsMap?.[productType ?? ''],
    [requisites?.additionalEquipmentsMap, productType],
  )

  const brokerOptions = useMemo(
    () =>
      (optionRequisite?.brokers || []).map(v => ({
        value: v.brokerCode,
        label: v.brokerName,
      })),
    [optionRequisite?.brokers],
  )

  const currentBroker = useMemo(
    () => optionRequisite?.brokersMap?.[broker || ''],
    [optionRequisite?.brokersMap, broker],
  )

  const banksOptions = useMemo(
    () =>
      (currentBroker?.requisites || []).map(r => ({
        value: r.bankName,
      })),
    [currentBroker?.requisites],
  )
  const currentBank = useMemo(
    () => currentBroker?.requisitesMap[beneficiaryBank],
    [beneficiaryBank, currentBroker?.requisitesMap],
  )

  const accountNumberOptions = useMemo(
    () => (currentBank?.accounts || []).map(a => ({ value: a })),
    [currentBank?.accounts],
  )

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(
        namePrefix + FormFieldNameMap.broker,
        currentBroker?.brokerCode || FULL_INITIAL_ADDITIONAL_EQUIPMENTS.broker,
      )
    }
  }, [currentBroker?.brokerCode, isCustomFields, isRequisitesFetched, namePrefix, setFieldValue])

  useEffect(() => {
    setFieldValue(namePrefix + FormFieldNameMap.brokerName, currentBroker?.brokerName)
  }, [currentBroker?.brokerName, namePrefix, setFieldValue])

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(
        namePrefix + 'beneficiaryBank',
        currentBroker?.requisites?.find(r => r.bankName === beneficiaryBank)?.bankName || '',
      )
    }
  }, [
    beneficiaryBank,
    currentBroker?.requisites,
    isCustomFields,
    isRequisitesFetched,
    namePrefix,
    setFieldValue,
  ])

  useEffect(() => {
    if (currentBroker?.tax) {
      setFieldValue(namePrefix + 'taxPercent', currentBroker.tax)
      setFieldValue(namePrefix + 'taxValue', currentBroker.tax * parseFloat(productCost || '0'))
    } else {
      setFieldValue(namePrefix + 'taxPercent', null)
      setFieldValue(namePrefix + 'taxValue', null)
    }
  }, [currentBroker?.tax, namePrefix, productCost, setFieldValue])

  useEffect(() => {
    if (!isCredit) {
      setFieldValue(namePrefix + FormFieldNameMap.broker, FULL_INITIAL_ADDITIONAL_EQUIPMENTS.broker)
      setFieldValue(namePrefix + 'documentType', null)
      setFieldValue(namePrefix + 'documentNumber', '')
      setFieldValue(namePrefix + 'documentDate', null)
      setFieldValue(namePrefix + 'bankIdentificationCode', '')
      setFieldValue(namePrefix + 'beneficiaryBank', '')
      setFieldValue(namePrefix + 'bankAccountNumber', '')
      setFieldValue(namePrefix + 'correspondentAccount', undefined)
      setFieldValue(namePrefix + 'taxPresence', undefined)
      setFieldValue(namePrefix + 'taxation', undefined)
    }
  }, [isCredit, namePrefix, setFieldValue])

  return {
    currentBroker,
    brokerOptions,
    banksOptions,
    currentBank,
    accountNumberOptions,
  }
}
