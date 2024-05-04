import { useCallback } from 'react'

import {
  GetRequisitesForFinancingResponse,
  Requisite,
  GetRequisitesForFinancingRequest,
  Broker,
  AdditionalOptionRsForFinancing,
  ProviderBroker,
  AdditionalEquipmentRsForFinancing,
  Vendor,
  VendorRequisites,
} from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryOptions, useQuery } from 'react-query'

import { getRequisitesForFinancing } from 'shared/api/requests/dictionaryDc.api'

export interface RequiredRequisite extends Requisite {
  bankName: string
}
export interface PreparedBroker extends Broker {
  brokerCode: number
  requisites: RequiredRequisite[]
}
export interface PreparedBrokerMap extends PreparedBroker {
  requisitesMap: Record<string, RequiredRequisite>
}
export interface PreparedProviderBroker extends ProviderBroker {
  providerCode: number
  brokers: PreparedBroker[]
}
export interface PreparedProviderBrokerMap extends PreparedProviderBroker {
  brokersMap: Record<string, PreparedBrokerMap>
}
export interface PreparedAdditionalOptions extends AdditionalOptionRsForFinancing {
  providerBrokers: PreparedProviderBroker[]
  providerBrokersMap: Record<string, PreparedProviderBrokerMap>
}

export interface PreparedAdditionalEquipment extends AdditionalEquipmentRsForFinancing {
  brokers: PreparedBroker[]
  brokersMap: Record<string, PreparedBrokerMap>
}

export interface PreparedVendor extends VendorRequisites {
  requisites: RequiredRequisite[]
  requisitesMap: Record<string, RequiredRequisite>
}
export interface RequisitesForFinancing extends GetRequisitesForFinancingResponse {
  vendor: PreparedVendor
  dealerOptionsMap: Record<string, PreparedAdditionalOptions> // dima + id. а он нужен?
  additionalEquipmentsMap: Record<string, PreparedAdditionalEquipment>
  bankOptionsMap: Record<string, PreparedAdditionalOptions>
}

const prepareRequisites = (requisites: Requisite[]) =>
  requisites.reduce(
    (acc, cur) => {
      if (cur.bankName) {
        acc.requiredRequisites.push(cur as RequiredRequisite)
        acc.requisitesMap[cur.bankName] = cur as RequiredRequisite
      }

      return acc
    },
    {
      requiredRequisites: [] as RequiredRequisite[],
      requisitesMap: {} as Record<string, RequiredRequisite>,
    },
  )

const prepareBrokers = (broker: Broker[]) =>
  broker.reduce(
    (acc, cur) => {
      if (cur.brokerCode) {
        const { requiredRequisites, requisitesMap } = prepareRequisites(cur.requisites || [])
        const newBroker = {
          ...cur,
          brokerCode: cur.brokerCode,
          requisites: requiredRequisites,
        }

        acc.requiredBrokers.push(newBroker)
        acc.brokersMap[cur.brokerCode] = { ...newBroker, requisitesMap }
      }

      return acc
    },
    {
      requiredBrokers: [] as PreparedBroker[],
      brokersMap: {} as Record<string, PreparedBrokerMap>,
    },
  )

const prepareProviders = (providers: ProviderBroker[]) =>
  providers.reduce(
    (acc, cur) => {
      if (cur.providerCode) {
        const { requiredBrokers, brokersMap } = prepareBrokers(cur.brokers || [])
        const newProvider = {
          ...cur,
          providerCode: cur.providerCode,
          brokers: requiredBrokers,
        }
        acc.requiredProviders.push(newProvider)
        acc.providersMap[cur.providerCode] = { ...newProvider, brokersMap }
      }

      return acc
    },
    {
      requiredProviders: [] as PreparedProviderBroker[],
      providersMap: {} as Record<string, PreparedProviderBrokerMap>,
    },
  )

const prepareAdditionalOptions = (
  optionMap: Record<string, AdditionalOptionRsForFinancing | null> | null | undefined,
) =>
  Object.keys(optionMap || []).reduce((acc, cur) => {
    const optionId = cur
    const { requiredProviders, providersMap } = prepareProviders(optionMap?.[cur]?.providerBrokers || [])
    acc[optionId] = {
      providerBrokers: requiredProviders,
      providerBrokersMap: providersMap,
    }

    return acc
  }, {} as Record<string, PreparedAdditionalOptions>)

const prepareAdditionalEquipments = (
  equipmentMap: Record<string, AdditionalEquipmentRsForFinancing | null> | null | undefined,
) =>
  Object.keys(equipmentMap || []).reduce((acc, cur) => {
    const optionId = cur
    const { requiredBrokers, brokersMap } = prepareBrokers(equipmentMap?.[cur]?.brokers || [])
    acc[optionId] = {
      brokers: requiredBrokers,
      brokersMap,
    }

    return acc
  }, {} as Record<string, PreparedAdditionalEquipment>)

const prepareData = (res: GetRequisitesForFinancingResponse): RequisitesForFinancing => {
  const dealerOptionsMap = prepareAdditionalOptions(res.additionalOptions)
  const additionalEquipmentsMap = prepareAdditionalEquipments(res.additionalEquipment)
  const bankOptionsMap = prepareAdditionalOptions(res.bankOptions)
  const { requiredRequisites, requisitesMap } = prepareRequisites(res.vendor?.requisites || [])
  const vendor: PreparedVendor = {
    ...res.vendor,
    requisites: requiredRequisites,
    requisitesMap,
  }

  return {
    vendor,
    dealerOptionsMap,
    additionalEquipmentsMap,
    bankOptionsMap,
  }
}

export const useRequisitesForFinancingQuery = (
  params: GetRequisitesForFinancingRequest,
  options?: UseQueryOptions<
    GetRequisitesForFinancingResponse,
    unknown,
    RequisitesForFinancing,
    (string | GetRequisitesForFinancingRequest)[]
  >,
) => {
  const { enqueueSnackbar } = useSnackbar()
  const onError = useCallback(
    () => enqueueSnackbar('Не удалось получить список реквизитов', { variant: 'error' }),
    [enqueueSnackbar],
  )

  return useQuery(['getRequisitesForFinancing', params], () => getRequisitesForFinancing(params), {
    onError,
    ...options,
    select: res => prepareData(res),
  })
}
