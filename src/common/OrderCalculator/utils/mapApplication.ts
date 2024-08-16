import { LoanCarFrontdc, LoanDataFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { stringToNumber } from 'shared/utils/stringToNumber'

import { AUTO_TYPE_MAP } from '../config'
import {
  AutoCategory,
  BriefOrderCalculatorFields,
  FullOrderCalculatorFields,
  NormalizedCarsInfo,
} from '../types'
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
  carModel: string | null,
  carCondition: number,
  carsData: NormalizedCarsInfo | undefined,
) => {
  const carsInfo = carCondition ? carsData?.newCarsInfo : carsData?.usedCarsInfo
  const currentCarBrand = carsInfo?.brandMap[carBrand ?? '']
  const currentCarModel = currentCarBrand?.modelMap[carModel ?? '']

  return {
    mark: getCountryMark(currentCarBrand?.madeIn),
    countryMade: currentCarBrand?.madeIn,
    type: AUTO_TYPE_MAP[currentCarBrand?.autoCategory as AutoCategory],
    category: currentCarBrand?.autoCategory,
    mass: currentCarModel?.mass,
  }
}

export const mapCommonApplicationValues = (
  values: BriefOrderCalculatorFields | FullOrderCalculatorFields,
  carsData: NormalizedCarsInfo | undefined,
) => {
  const {
    isGovernmentProgram,
    isDfoProgram,
    carCost,
    carBrand,
    carModel,
    carCondition,
    carMileage,
    carYear,
    governmentProgram,
    governmentName,
    creditProduct,
    initialPayment,
    initialPaymentPercent,
    loanTerm,
  } = values

  const commonLoanCar: LoanCarFrontdc = {
    brand: carBrand ?? undefined,
    isCarNew: !!carCondition,
    autoPrice: stringToNumber(carCost),
    mileage: carMileage,
    model: carModel ?? undefined,
    autoCreateYear: carYear ?? undefined,
    ...getCarCountryData(carBrand, carModel, carCondition, carsData),
  }
  const commonLoanData: LoanDataFrontdc = {
    productId: creditProduct ?? undefined,
    downpayment: stringToNumber(initialPayment),
    downpaymentInPercent: stringToNumber(initialPaymentPercent),
    term: loanTerm ?? undefined,
    govprogramCode: isGovernmentProgram ? governmentProgram ?? undefined : undefined,
    govprogramName: isGovernmentProgram ? governmentName ?? undefined : undefined,
    // govprogramDiscount - тут не нужна, заполняется из ручки calculateCredit при выборе предложения от банка
    govprogramDfoFlag: isDfoProgram,
  }

  return {
    commonLoanCar,
    commonLoanData,
  }
}
