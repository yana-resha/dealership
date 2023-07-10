import {
  AdditionalOption as VendorOptionProto,
  AdditionalOptionCalculateCredit,
  CalculateCreditRequest,
  LoanCar,
  OptionID,
} from '@sberauto/dictionarydc-proto/public'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import {
  FormFieldNameMap,
  FullOrderCalculatorFields,
  OrderCalculatorAdditionalService,
  OrderCalculatorFields,
} from '../types'
import { ProductsMap } from './prepareCreditProductListData'

const mapAdditionalOptions = (
  additionalOptions: OrderCalculatorAdditionalService[],
  vendorOptionsMap: Record<OptionID, VendorOptionProto>,
): AdditionalOptionCalculateCredit[] => {
  const filteredOptions = additionalOptions.filter(
    (option): option is Omit<typeof option, 'productType'> & { productType: OptionID } =>
      option.productType !== '',
  )

  const additionalOptionsFormatted: AdditionalOptionCalculateCredit[] = filteredOptions.map(filterOption => {
    const option = vendorOptionsMap[filterOption.productType]

    const additionalOption: AdditionalOptionCalculateCredit = {
      optionId: option.optionId,
      optionType: option.optionType,
      optionName: option.optionName,
      cascoType: option.cascoType,
      cascoLimit: filterOption.cascoLimit ? parseInt(filterOption.cascoLimit, 10) : undefined,
      franchise: option.franchise,
      inServicePackageFlag: option.inServicePackageFlag,
      tariff: option.tariff,

      price: parseInt(filterOption?.productCost || '0', 10),
      inCreditFlag: filterOption.isCredit,
    }

    return additionalOption
  })

  return additionalOptionsFormatted
}

const getAdditionalOptionsPrice = (options: AdditionalOptionCalculateCredit[]) =>
  options.reduce((acc: number, element) => acc + (element.price || 0), 0)

const getAdditionalOptionsPriceInCredit = (options: AdditionalOptionCalculateCredit[]) =>
  options.reduce((acc: number, element) => acc + (element.inCreditFlag ? element.price || 0 : 0), 0)

export const mapValuesForCalculateCreditRequest = (
  values: OrderCalculatorFields | FullOrderCalculatorFields,
  vendorOptionsMap: Record<OptionID, VendorOptionProto>,
  productsMap?: ProductsMap,
): CalculateCreditRequest => {
  const { vendorCode } = getPointOfSaleFromCookies()

  const additionalOptions: AdditionalOptionCalculateCredit[] = [
    ...mapAdditionalOptions(values[ServicesGroupName.additionalEquipments], vendorOptionsMap),
    ...mapAdditionalOptions(values[ServicesGroupName.dealerAdditionalServices], vendorOptionsMap),
  ]

  const loanCar: LoanCar = {
    isCarNew: !!values[FormFieldNameMap.carCondition],
    autoCreateYear: values[FormFieldNameMap.carYear],
    mileage: parseInt(values[FormFieldNameMap.carMileage], 10),
    brand: values[FormFieldNameMap.carBrand] || '',
    model: values[FormFieldNameMap.carModel] || '',
    autoPrice: parseInt(values[FormFieldNameMap.carCost], 10),
    equipmentPrice: getAdditionalOptionsPrice(additionalOptions),
    equipmentPriceInCredit: getAdditionalOptionsPriceInCredit(additionalOptions),
  }
  const calculateCreditRequest: CalculateCreditRequest = {
    vendorCode,
    productId: values[FormFieldNameMap.creditProduct],
    productCodeName: productsMap?.[values[FormFieldNameMap.creditProduct]]?.productCodeName,
    productName: productsMap?.[values[FormFieldNameMap.creditProduct]]?.productName,
    downpayment: parseInt(values[FormFieldNameMap.initialPayment], 10),
    term: parseInt(values[FormFieldNameMap.loanTerm].toString(), 10),
    amountWithOptions:
      parseInt(values[FormFieldNameMap.carCost] ?? 0, 10) +
      getAdditionalOptionsPriceInCredit(additionalOptions) -
      parseInt(values[FormFieldNameMap.initialPayment] ?? 0, 10),
    amountWithoutOptions:
      parseInt(values[FormFieldNameMap.carCost] ?? 0, 10) -
      parseInt(values[FormFieldNameMap.initialPayment] ?? 0, 10),
    additionalOptions: additionalOptions,
    loanCar: loanCar,
  }

  return calculateCreditRequest
}
