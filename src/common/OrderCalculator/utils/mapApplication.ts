import { LoanCarFrontdc, LoanDataFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { stringToNumber } from 'shared/utils/stringToNumber'

import { AUTO_TYPE_MAP } from '../config'
import { AutoCategory, BriefOrderCalculatorFields, FullOrderCalculatorFields, NormalizedCars } from '../types'
import { CountryMade, CountryMark } from '../types'

function getCountryMark(countryMade: string | undefined) {
  switch (countryMade) {
    case CountryMade.Domestic:
      return CountryMark.Domestic
    case CountryMade.China:
      return CountryMark.China
    default:
      return CountryMark.Foreign
  }
}

const getCarCountryData = (
  carBrand: string | null,
  carCondition: number,
  carsData: NormalizedCars | undefined,
) => {
  const cars = (carCondition ? carsData?.newCars : carsData?.usedCars) || {}
  const currentCarBrand = cars[carBrand ?? '']

  return {
    mark: getCountryMark(currentCarBrand?.madeIn),
    countryMade: currentCarBrand?.madeIn,
    type: AUTO_TYPE_MAP[currentCarBrand?.autoCategory as AutoCategory],
    category: currentCarBrand?.autoCategory,
  }
}

export const mapCommonApplicationValues = (
  values: BriefOrderCalculatorFields | FullOrderCalculatorFields,
  carsData: NormalizedCars | undefined,
) => {
  const {
    carCost,
    carModel,
    carBrand,
    carCondition,
    carMileage,
    carYear,
    initialPayment,
    initialPaymentPercent,
    loanTerm,
    creditProduct,
  } = values

  const commonLoanCar: LoanCarFrontdc = {
    brand: carBrand ?? undefined,
    isCarNew: !!carCondition,
    autoPrice: stringToNumber(carCost),
    mileage: carMileage,
    model: carModel ?? undefined,
    autoCreateYear: carYear,
    ...getCarCountryData(carBrand, carCondition, carsData),
  }
  const commonLoanData: LoanDataFrontdc = {
    productId: creditProduct ?? undefined,
    downpayment: stringToNumber(initialPayment),
    downpaymentInPercent: stringToNumber(initialPaymentPercent),
    term: loanTerm ?? undefined,
  }

  return {
    commonLoanCar,
    commonLoanData,
  }
}
