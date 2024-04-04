import { useEffect, useMemo } from 'react'

import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { useFormikContext } from 'formik'

import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'

import { RequisitesForFinancing } from '../../hooks/useRequisitesForFinancingQuery'

type Params = {
  isCustomFields: boolean
  isRequisitesFetched: boolean
  namePrefix: string
  requisites: RequisitesForFinancing | undefined
  productType: OptionID | null
  legalPersonCode: string
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
  legalPersonCode,
  productCost,
  isCredit,
}: Params) {
  const { setFieldValue } = useFormikContext<FullOrderCalculatorFields>()

  const optionRequisite = useMemo(
    () => requisites?.additionalEquipmentsMap?.[productType ?? ''],
    [requisites?.additionalEquipmentsMap, productType],
  )

  const currentProvider = useMemo(
    () => optionRequisite?.providerBrokersMap && Object.values(optionRequisite?.providerBrokersMap)[0],
    [optionRequisite?.providerBrokersMap],
  )

  const brokerOptions = useMemo(
    () =>
      (currentProvider?.brokers || []).map(v => ({
        value: v.brokerCode,
        label: v.brokerName,
      })),
    [currentProvider?.brokers],
  )

  const currentBroker = useMemo(
    () => currentProvider?.brokersMap?.[legalPersonCode],
    [currentProvider?.brokersMap, legalPersonCode],
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
        namePrefix + 'legalPersonCode',
        currentBroker?.brokerCode ? currentBroker?.brokerCode : '',
      )
    }
  }, [currentBroker?.brokerCode, isCustomFields, isRequisitesFetched, namePrefix, setFieldValue])

  useEffect(() => {
    setFieldValue(namePrefix + 'legalPersonName', currentBroker?.brokerName)
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
      setFieldValue(namePrefix + 'taxValue', currentBroker.tax * parseInt(productCost || '0', 10))
    } else {
      setFieldValue(namePrefix + 'taxPercent', null)
      setFieldValue(namePrefix + 'taxValue', null)
    }
  }, [currentBroker?.tax, namePrefix, productCost, setFieldValue])

  useEffect(() => {
    if (!isCredit) {
      setFieldValue(namePrefix + 'legalPersonCode', '')
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
    brokerOptions,
    banksOptions,
    currentBank,
    accountNumberOptions,
  }
}
