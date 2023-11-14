import { useCallback } from 'react'

import {
  GetRequisitesForFinancingResponse,
  Requisite,
  GetRequisitesForFinancingRequest,
  OptionID,
  OptionType,
  Broker,
  AdditionalOptionRsForFinancing,
  ProviderBroker,
} from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryOptions, useQuery } from 'react-query'

import { getRequisitesForFinancing } from 'shared/api/requests/dictionaryDc.api'
import { prepareOptionId, prepareOptionType } from 'shared/lib/helpers'

export interface RequiredRequisite extends Requisite {
  bankName: string
}
export interface PreparedBroker extends Broker {
  brokerCode: string
  requisites: RequiredRequisite[]
}
export interface PreparedBrokerMap extends PreparedBroker {
  requisitesMap: Record<string, RequiredRequisite>
}
export interface PreparedProviderBroker extends ProviderBroker {
  providerCode: string
  brokers: PreparedBroker[]
}
export interface PreparedProviderBrokerMap extends PreparedProviderBroker {
  brokersMap: Record<string, PreparedBrokerMap>
}
export interface PreparedAdditionalOptionForFinancing extends AdditionalOptionRsForFinancing {
  optionId: OptionID
  providerBrokers: PreparedProviderBroker[]
}
export interface PreparedAdditionalOptionForFinancingMap extends PreparedAdditionalOptionForFinancing {
  providerBrokersMap: Record<string, PreparedProviderBrokerMap>
}
export interface RequisitesForFinancing extends GetRequisitesForFinancingResponse {
  dealerCenterBrokers: PreparedBroker[]
  dealerCenterBrokersMap: Record<string, PreparedBrokerMap>
  additionalEquipments: PreparedAdditionalOptionForFinancing[]
  additionalEquipmentsMap: Record<string, PreparedAdditionalOptionForFinancingMap>
  dealerOptions: PreparedAdditionalOptionForFinancing[]
  dealerOptionsMap: Record<string, PreparedAdditionalOptionForFinancingMap>
  bankOptions: PreparedAdditionalOptionForFinancing[]
  bankOptionsMap: Record<string, PreparedAdditionalOptionForFinancingMap>
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

const prepareAdditionalOptions = (options: AdditionalOptionRsForFinancing[]) =>
  options.reduce(
    (acc, cur) => {
      const optionId = prepareOptionId(cur.optionId as unknown as keyof typeof OptionID)
      const optionType = prepareOptionType(cur.optionType as unknown as keyof typeof OptionType)
      if (optionId) {
        const { requiredProviders, providersMap } = prepareProviders(cur.providerBrokers || [])
        const newOptions = {
          ...cur,
          optionId: optionId,
          optionType: optionType,
          providerBrokers: requiredProviders,
        }
        if (optionType === OptionType.EQUIPMENT) {
          acc.additionalEquipments.push(newOptions)
          acc.additionalEquipmentsMap[optionId] = { ...newOptions, providerBrokersMap: providersMap }
        }
        if (optionType === OptionType.DEALER) {
          acc.dealerOptions.push(newOptions)
          acc.dealerOptionsMap[optionId] = { ...newOptions, providerBrokersMap: providersMap }
        }
        if (optionType === OptionType.BANK) {
          acc.bankOptions.push(newOptions)
          acc.bankOptionsMap[optionId] = { ...newOptions, providerBrokersMap: providersMap }
        }
      }

      return acc
    },
    {
      additionalEquipments: [] as PreparedAdditionalOptionForFinancing[],
      additionalEquipmentsMap: {} as Record<string, PreparedAdditionalOptionForFinancingMap>,
      dealerOptions: [] as PreparedAdditionalOptionForFinancing[],
      dealerOptionsMap: {} as Record<string, PreparedAdditionalOptionForFinancingMap>,
      bankOptions: [] as PreparedAdditionalOptionForFinancing[],
      bankOptionsMap: {} as Record<string, PreparedAdditionalOptionForFinancingMap>,
    },
  )

const prepareData = (res: GetRequisitesForFinancingResponse): RequisitesForFinancing => {
  const { requiredBrokers, brokersMap } = prepareBrokers(res.dealerCenterBrokers || [])

  const {
    additionalEquipments,
    additionalEquipmentsMap,
    dealerOptions,
    dealerOptionsMap,
    bankOptions,
    bankOptionsMap,
  } = prepareAdditionalOptions([...(res.additionalEquipments ?? []), ...(res.additionalOptions ?? [])])

  return {
    dealerCenterBrokers: requiredBrokers,
    dealerCenterBrokersMap: brokersMap,
    additionalEquipments,
    additionalEquipmentsMap,
    dealerOptions,
    dealerOptionsMap,
    bankOptions,
    bankOptionsMap,
  }
}

export const useRequisitesForFinancingQuery = (
  params: GetRequisitesForFinancingRequest,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getRequisitesForFinancing>>,
    unknown,
    RequisitesForFinancing,
    string[]
  >,
) => {
  const { enqueueSnackbar } = useSnackbar()
  const onError = useCallback(
    () => enqueueSnackbar('Не удалось получить список реквизитов', { variant: 'error' }),
    [enqueueSnackbar],
  )

  const paramsKeys = {
    vendorCode: params.vendorCode || '',
    additionalEquipments: (params.additionalEquipments || []).filter(o => !!o) as unknown as string[],
    additionalOptions: (params.additionalOptions || []).filter(o => !!o) as unknown as string[],
  }

  return useQuery(
    [
      'getRequisitesForFinancing',
      paramsKeys.vendorCode,
      ...paramsKeys.additionalEquipments,
      ...paramsKeys.additionalOptions,
    ],
    () => getRequisitesForFinancing(params),
    {
      onError,
      ...options,
      select: res => prepareData(res),
    },
  )
}
