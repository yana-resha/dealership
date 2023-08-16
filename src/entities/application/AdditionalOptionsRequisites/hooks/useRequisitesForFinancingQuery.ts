import { useCallback } from 'react'

import {
  GetRequisitesForFinancingResponse,
  Requisite,
  VendorWithoutBroker,
  GetRequisitesForFinancingRequest,
  AdditionalEquipmentRsForFinancing,
  OptionID,
  OptionType,
  VendorWithBroker,
  Broker,
  AdditionalOptionRsForFinancing,
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

export interface PreparedVendorWithoutBroker extends VendorWithoutBroker {
  vendorCode: string
  requisites: RequiredRequisite[]
}
export interface PreparedVendorWithoutBrokerMap extends PreparedVendorWithoutBroker {
  requisitesMap: Record<string, RequiredRequisite>
}

export interface PreparedVendorWithBroker extends VendorWithBroker {
  vendorCode: string
  brokers: PreparedBroker[]
}
export interface PreparedVendorWithBrokerMap extends PreparedVendorWithBroker {
  brokersMap: Record<string, PreparedBrokerMap>
}

export interface PreparedAdditionalEquipmentForFinancing extends AdditionalEquipmentRsForFinancing {
  optionId: OptionID
  vendorsWithoutBroker: PreparedVendorWithoutBroker[]
}
export interface PreparedAdditionalEquipmentForFinancingMap extends PreparedAdditionalEquipmentForFinancing {
  vendorsWithoutBrokerMap: Record<string, PreparedVendorWithoutBrokerMap>
}

export interface PreparedAdditionalOptionForFinancing extends AdditionalOptionRsForFinancing {
  optionId: OptionID
  vendorsWithBroker: PreparedVendorWithBroker[]
}
export interface PreparedAdditionalOptionForFinancingMap extends PreparedAdditionalOptionForFinancing {
  vendorsWithBrokerMap: Record<string, PreparedVendorWithBrokerMap>
}

export interface RequisitesForFinancing extends GetRequisitesForFinancingResponse {
  vendorAccounts: PreparedVendorWithoutBrokerMap
  additionalEquipments: PreparedAdditionalEquipmentForFinancing[]
  additionalEquipmentsMap: Record<string, PreparedAdditionalEquipmentForFinancingMap>
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
        const newRequisit = {
          ...cur,
          brokerCode: cur.brokerCode,
          requisites: requiredRequisites,
        }

        acc.requiredBrokers.push(newRequisit)
        acc.brokersMap[cur.brokerCode] = { ...newRequisit, requisitesMap }
      }

      return acc
    },
    {
      requiredBrokers: [] as PreparedBroker[],
      brokersMap: {} as Record<string, PreparedBrokerMap>,
    },
  )

const prepareVendorsWithoutBrokers = (vendors: VendorWithoutBroker[]) =>
  vendors.reduce(
    (acc, cur) => {
      if (cur.vendorCode) {
        const { requiredRequisites, requisitesMap } = prepareRequisites(cur.requisites || [])
        const newRequisit = {
          ...cur,
          vendorCode: cur.vendorCode,
          requisites: requiredRequisites,
        }

        acc.requiredVendors.push(newRequisit)
        acc.vendorsMap[cur.vendorCode] = { ...newRequisit, requisitesMap }
      }

      return acc
    },
    {
      requiredVendors: [] as PreparedVendorWithoutBroker[],
      vendorsMap: {} as Record<string, PreparedVendorWithoutBrokerMap>,
    },
  )

const prepareVendorsWithBrokers = (vendors: VendorWithBroker[]) =>
  vendors.reduce(
    (acc, cur) => {
      if (cur.vendorCode) {
        const { requiredBrokers, brokersMap } = prepareBrokers(cur.brokers || [])
        const newRequisit = {
          ...cur,
          vendorCode: cur.vendorCode,
          brokers: requiredBrokers,
        }

        acc.requiredVendors.push(newRequisit)
        acc.vendorsMap[cur.vendorCode] = { ...newRequisit, brokersMap }
      }

      return acc
    },
    {
      requiredVendors: [] as PreparedVendorWithBroker[],
      vendorsMap: {} as Record<string, PreparedVendorWithBrokerMap>,
    },
  )

const prepareEquipments = (equipments: AdditionalEquipmentRsForFinancing[]) =>
  equipments.reduce(
    (acc, cur) => {
      const optionId = prepareOptionId(cur.optionId as unknown as keyof typeof OptionID)
      const optionType = prepareOptionType(cur.optionType as unknown as keyof typeof OptionType)
      if (optionId) {
        const { requiredVendors, vendorsMap } = prepareVendorsWithoutBrokers(cur.vendorsWithoutBroker || [])
        const newEquipments = {
          ...cur,
          optionId: optionId,
          optionType: optionType,
          vendorsWithoutBroker: requiredVendors,
        }

        acc.additionalEquipments.push(newEquipments)
        acc.additionalEquipmentsMap[optionId] = { ...newEquipments, vendorsWithoutBrokerMap: vendorsMap }
      }

      return acc
    },
    {
      additionalEquipments: [] as PreparedAdditionalEquipmentForFinancing[],
      additionalEquipmentsMap: {} as Record<string, PreparedAdditionalEquipmentForFinancingMap>,
    },
  )

const prepareAdditionalOptions = (options: AdditionalOptionRsForFinancing[]) =>
  options.reduce(
    (acc, cur) => {
      const optionId = prepareOptionId(cur.optionId as unknown as keyof typeof OptionID)
      const optionType = prepareOptionType(cur.optionType as unknown as keyof typeof OptionType)
      if (optionId) {
        const { requiredVendors, vendorsMap } = prepareVendorsWithBrokers(cur.vendorsWithBroker || [])
        const newEquipments = {
          ...cur,
          optionId: optionId,
          optionType: optionType,
          vendorsWithBroker: requiredVendors,
        }
        if (optionType === OptionType.DEALER) {
          acc.dealerOptions.push(newEquipments)
          acc.dealerOptionsMap[optionId] = { ...newEquipments, vendorsWithBrokerMap: vendorsMap }
        }
        if (optionType === OptionType.BANK) {
          acc.bankOptions.push(newEquipments)
          acc.bankOptionsMap[optionId] = { ...newEquipments, vendorsWithBrokerMap: vendorsMap }
        }
      }

      return acc
    },
    {
      dealerOptions: [] as PreparedAdditionalOptionForFinancing[],
      dealerOptionsMap: {} as Record<string, PreparedAdditionalOptionForFinancingMap>,
      bankOptions: [] as PreparedAdditionalOptionForFinancing[],
      bankOptionsMap: {} as Record<string, PreparedAdditionalOptionForFinancingMap>,
    },
  )

const prepareData = (res: GetRequisitesForFinancingResponse) => {
  const { requiredRequisites, requisitesMap } = prepareRequisites(res.vendorAccounts?.requisites || [])
  const vendorAccounts = {
    ...(res.vendorAccounts || {}),
    vendorCode: res.vendorAccounts?.vendorCode || '',
    requisites: requiredRequisites,
    requisitesMap: requisitesMap,
  }

  const { additionalEquipments, additionalEquipmentsMap } = prepareEquipments(res.additionalEquipments || [])
  const { dealerOptions, dealerOptionsMap, bankOptions, bankOptionsMap } = prepareAdditionalOptions(
    res.additionalOptions || [],
  )

  return {
    ...res,
    vendorAccounts,
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
