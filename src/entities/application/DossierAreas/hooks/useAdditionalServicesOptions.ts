import { useMemo } from 'react'

export interface AdditionalServiceItem {
  productType: number | undefined
}
export enum ServicesGroupName {
  additionalEquipments = 'additionalEquipments',
  dealerAdditionalServices = 'dealerAdditionalServices',
  bankAdditionalServices = 'bankAdditionalServices',
}

type Values = {
  [ServicesGroupName.additionalEquipments]?: AdditionalServiceItem[]
  [ServicesGroupName.dealerAdditionalServices]?: AdditionalServiceItem[]
  [ServicesGroupName.bankAdditionalServices]?: AdditionalServiceItem[]
}

type Params = {
  values: Values
  index: number
  parentName: ServicesGroupName
  options:
    | {
        value: string | number
        label: string
      }[]
    | undefined
}
export function useAdditionalServicesOptions({ values, index, parentName, options }: Params) {
  const selectedServices = values[parentName as keyof Values]
  const currentService = selectedServices?.[index]
  const filteredOptions = useMemo(
    () =>
      options?.filter(
        o =>
          !selectedServices?.some(s => `${s.productType}` === `${o.value}`) ||
          `${o.value}` === `${currentService?.productType}`,
      ) || [],
    [currentService?.productType, options, selectedServices],
  )

  return {
    filteredOptions,
    shouldDisableAdding: selectedServices?.length === (options?.length || 0),
  }
}
