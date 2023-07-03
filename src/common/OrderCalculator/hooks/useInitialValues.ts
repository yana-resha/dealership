import { useCallback, useMemo } from 'react'

import { BankOptionType, LoanCarFrontdc, VendorFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { useDispatch } from 'react-redux'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { updateOrder } from 'pages/CreateOrderPage/model/orderSlice'
import {
  AdditionalOptionFrontdc,
  ApplicationFrontDc,
  GetFullApplicationResponse,
  LoanDataFrontdc,
} from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { convertedDateToString } from 'shared/utils/dateTransform'

import { CAR_PASSPORT_TYPE, INITIAL_CAR_ID_TYPE } from '../config'
import { FormFieldNameMap, FullOrderCalculatorFields, OrderCalculatorFields } from '../types'

type CalculatorFields<D> = D extends boolean ? FullOrderCalculatorFields : OrderCalculatorFields

export function useInitialValues<D extends boolean | undefined>(
  initialData: CalculatorFields<D>,
  isFullCalculator?: D,
) {
  const initialOrder = useAppSelector(state => state.order.order)
  const dispatch = useDispatch()
  const { vendorCode } = getPointOfSaleFromCookies()
  const fullApplicationData = initialOrder?.orderData

  const { loanCar, loanData, vendor, specialMark } = useMemo(
    () => fullApplicationData?.application || ({} as ApplicationFrontDc),
    [fullApplicationData?.application],
  )

  const { additionalEquipments, dealerAdditionalServices, bankAdditionalServices } = useMemo(
    () =>
      (loanData?.additionalOptions || []).reduce(
        (acc, cur) => {
          if (!cur.bankOptionType && cur.bankOptionType !== BankOptionType.BANKSERVICES) {
            return acc
          }

          const additionalServiceBaseData = {
            [FormFieldNameMap.productType]: cur.type ?? initialData.additionalEquipments[0].productType,
            [FormFieldNameMap.productCost]: `${cur.price ?? initialData.additionalEquipments[0].productCost}`,
            [FormFieldNameMap.isCredit]: cur.inCreditFlag ?? initialData.additionalEquipments[0].isCredit,
            [FormFieldNameMap.documentType]: cur.docType ?? initialData.additionalEquipments[0].documentType,
            [FormFieldNameMap.documentNumber]:
              cur.docNumber ?? initialData.additionalEquipments[0].documentNumber,
            [FormFieldNameMap.documentDate]: cur.docDate
              ? new Date(cur.docDate)
              : initialData.additionalEquipments[0].documentDate,
          }
          const additionalServiceRequisitesData = isFullCalculator
            ? {
                [FormFieldNameMap.bankIdentificationCode]:
                  cur.bankOptionType === BankOptionType.DEALERSERVICES
                    ? cur.brokerAccount?.bic
                    : cur.vendorAccount?.bic ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0]
                        .bankIdentificationCode,
                [FormFieldNameMap.beneficiaryBank]:
                  cur.bankOptionType === BankOptionType.DEALERSERVICES
                    ? cur.brokerAccount?.bank
                    : cur.vendorAccount?.bank ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].beneficiaryBank,
                [FormFieldNameMap.bankAccountNumber]:
                  cur.bankOptionType === BankOptionType.DEALERSERVICES
                    ? cur.brokerAccount?.accountNumber
                    : cur.vendorAccount?.accountNumber ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].bankAccountNumber,
                [FormFieldNameMap.isCustomFields]:
                  cur.bankOptionType === BankOptionType.DEALERSERVICES
                    ? cur.brokerAccount?.accManualEnter
                    : cur.vendorAccount?.accManualEnter ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].isCustomFields,
                [FormFieldNameMap.correspondentAccount]:
                  cur.bankOptionType === BankOptionType.DEALERSERVICES
                    ? cur.brokerAccount?.accountCorrNumber
                    : cur.vendorAccount?.accountCorrNumber ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].correspondentAccount,
                [FormFieldNameMap.taxation]: `${
                  cur.bankOptionType === BankOptionType.DEALERSERVICES
                    ? cur.brokerAccount?.tax
                    : cur.vendorAccount?.tax ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].taxation
                }`,
              }
            : {}
          const dealerAdditionalServiceData = isFullCalculator
            ? {
                [FormFieldNameMap.provider]:
                  cur.vendor ??
                  (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].provider,
                [FormFieldNameMap.agent]:
                  cur.broker ?? (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].agent,
                [FormFieldNameMap.loanTerm]:
                  cur.term ?? (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].loanTerm,
              }
            : {}

          switch (cur.bankOptionType) {
            case BankOptionType.EQUIPMENTS: {
              if (acc.additionalEquipments.length === 1 && !acc.additionalEquipments[0].productType) {
                acc.additionalEquipments.shift()
              }
              acc.additionalEquipments.push({
                ...additionalServiceBaseData,
                [FormFieldNameMap.legalPerson]:
                  cur.vendor ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].legalPerson,
                ...additionalServiceRequisitesData,
              })
              break
            }
            case BankOptionType.DEALERSERVICES: {
              if (acc.dealerAdditionalServices.length === 1 && !acc.dealerAdditionalServices[0].productType) {
                acc.dealerAdditionalServices.shift()
              }
              acc.dealerAdditionalServices.push({
                ...additionalServiceBaseData,
                ...dealerAdditionalServiceData,
                ...additionalServiceRequisitesData,
              })
              break
            }
            // case BankOptionType.BANKSERVICES: {
            //   if (acc.bankAdditionalServices.length === 1 && !acc.bankAdditionalServices[0].productType) {
            //     acc.bankAdditionalServices.shift()
            //   }
            //   acc.bankAdditionalServices.push({
            //     ...additionalServiceBaseData,
            //     ...dealerAdditionalServiceData,
            //     ...additionalServiceRequisitesData,
            //   })
            //   break
            // }
          }

          return acc
        },
        {
          additionalEquipments: [...initialData.additionalEquipments],
          dealerAdditionalServices: [...initialData.dealerAdditionalServices],
          bankAdditionalServices: [...initialData.bankAdditionalServices],
        },
      ),
    [initialData, isFullCalculator, loanData?.additionalOptions],
  )

  const calculatorValuesPart = isFullCalculator
    ? {
        [FormFieldNameMap.carPassportType]:
          loanCar?.ptsNumber?.length === 10 ? CAR_PASSPORT_TYPE[1].value : CAR_PASSPORT_TYPE[0].value,
        [FormFieldNameMap.carPassportId]:
          loanCar?.ptsNumber ?? (initialData as FullOrderCalculatorFields).carPassportId,
        [FormFieldNameMap.carPassportCreationDate]: loanCar?.ptsDate
          ? new Date(loanCar.ptsDate)
          : (initialData as FullOrderCalculatorFields).carPassportCreationDate,
        [FormFieldNameMap.carIdType]:
          loanCar?.vinNumber && !loanCar?.carBody
            ? INITIAL_CAR_ID_TYPE[0].value
            : !loanCar?.vinNumber && loanCar?.carBody
            ? INITIAL_CAR_ID_TYPE[1].value
            : (initialData as FullOrderCalculatorFields).carIdType,
        [FormFieldNameMap.carId]:
          loanCar?.vinNumber ?? loanCar?.carBody ?? (initialData as FullOrderCalculatorFields).carId,
        [FormFieldNameMap.salesContractId]:
          loanCar?.dkpNumber ?? (initialData as FullOrderCalculatorFields).salesContractId,
        [FormFieldNameMap.salesContractDate]: loanCar?.dkpDate
          ? new Date(loanCar.dkpDate)
          : (initialData as FullOrderCalculatorFields).salesContractDate,
        [FormFieldNameMap.legalPerson]:
          vendor?.vendorCode ?? vendorCode ?? (initialData as FullOrderCalculatorFields).legalPerson,
        [FormFieldNameMap.loanAmount]: `${
          loanData?.amountWithoutAdd ?? (initialData as FullOrderCalculatorFields).loanAmount
        }`,
        [FormFieldNameMap.bankIdentificationCode]:
          vendor?.vendorBankDetails?.bic ?? (initialData as FullOrderCalculatorFields).bankIdentificationCode,
        [FormFieldNameMap.beneficiaryBank]:
          vendor?.vendorBankDetails?.bank ?? (initialData as FullOrderCalculatorFields).beneficiaryBank,
        [FormFieldNameMap.bankAccountNumber]:
          vendor?.vendorBankDetails?.accountNumber ??
          (initialData as FullOrderCalculatorFields).bankAccountNumber,
        [FormFieldNameMap.isCustomFields]:
          vendor?.accManualEnter ?? (initialData as FullOrderCalculatorFields).isCustomFields,
        [FormFieldNameMap.correspondentAccount]:
          vendor?.vendorBankDetails?.accountCorrNumber ??
          (initialData as FullOrderCalculatorFields).correspondentAccount,
        [FormFieldNameMap.taxation]:
          `${
            vendor?.vendorBankDetails?.tax ?? ((initialData as FullOrderCalculatorFields).taxation || '')
          }` || undefined,
      }
    : {
        [FormFieldNameMap.specialMark]: specialMark ?? (initialData as OrderCalculatorFields).specialMark,
      }

  const remapAdditionalOptionsForSmallCalculator = useCallback((values: OrderCalculatorFields) => {
    const { additionalEquipments, dealerAdditionalServices } = values
    const additionalOptionsFromCalculator = [additionalEquipments, dealerAdditionalServices]
    const additionalOptionsForApplication: AdditionalOptionFrontdc[] = []
    for (let i = 0; i < additionalOptionsFromCalculator.length; i++) {
      const additionalOption = additionalOptionsFromCalculator[i]
      const additionalOptionForApplication = additionalOption.reduce(
        (acc: AdditionalOptionFrontdc[], option) => {
          const { productCost, productType, isCredit } = option
          const additionalOption: AdditionalOptionFrontdc = {
            bankOptionType: i === 0 ? BankOptionType.EQUIPMENTS : BankOptionType.DEALERSERVICES,
            type: parseInt(productType.toString(), 10) ?? undefined,
            inCreditFlag: isCredit,
            price: parseInt(productCost, 10),
          }
          if (additionalOption.type) {
            acc.push(additionalOption)
          }

          return acc
        },
        [],
      )

      additionalOptionsForApplication.push(...additionalOptionForApplication)
    }

    return additionalOptionsForApplication
  }, [])

  const remapAdditionalOptionsForFullCalculator = useCallback((values: FullOrderCalculatorFields) => {
    const { additionalEquipments, dealerAdditionalServices } = values
    const additionalEquipmentForApplication = additionalEquipments.reduce(
      (acc: AdditionalOptionFrontdc[], option) => {
        const {
          productCost,
          taxValue,
          taxPercent,
          bankAccountNumber,
          correspondentAccount,
          legalPerson,
          bankIdentificationCode,
          beneficiaryBank,
          productType,
          documentType,
          documentNumber,
          documentDate,
          isCredit,
        } = option

        const additionalOption: AdditionalOptionFrontdc = {
          bankOptionType: BankOptionType.EQUIPMENTS,
          type: parseInt(productType.toString(), 10) ?? undefined,
          inCreditFlag: isCredit,
          price: parseInt(productCost, 10),
          vendor: legalPerson,
          docType: documentType.toString(),
          docNumber: documentNumber,
          docDate: convertedDateToString(documentDate),
          vendorAccount: {
            accountNumber: bankAccountNumber,
            accountCorrNumber: correspondentAccount,
            bank: beneficiaryBank,
            bic: bankIdentificationCode,
            tax: taxValue ?? undefined, //TODO Добавить taxPercent после изменения типа tax
          },
        }
        if (additionalOption.type) {
          acc.push(additionalOption)
        }

        return acc
      },
      [],
    )

    const additionalDealerServicesForApplication = dealerAdditionalServices.reduce(
      (acc: AdditionalOptionFrontdc[], option) => {
        const {
          provider,
          productCost,
          productType,
          isCredit,
          bankAccountNumber,
          correspondentAccount,
          providerTaxPercent,
          providerTaxValue,
          agentTaxPercent,
          agentTaxValue,
          bankIdentificationCode,
          beneficiaryBank,
          loanTerm,
          agent,
          documentType,
          documentNumber,
          documentDate,
        } = option
        const additionalOption: AdditionalOptionFrontdc = {
          bankOptionType: BankOptionType.DEALERSERVICES,
          vendor: provider,
          broker: agent,
          type: parseInt(productType.toString(), 10) ?? undefined,
          inCreditFlag: isCredit,
          price: parseInt(productCost, 10),
          term: loanTerm,
          docType: documentType.toString(),
          docNumber: documentNumber,
          docDate: convertedDateToString(documentDate),
          brokerAccount: {
            accountNumber: bankAccountNumber,
            accountCorrNumber: correspondentAccount,
            bank: beneficiaryBank,
            bic: bankIdentificationCode,
            tax: agentTaxValue ?? undefined, //TODO Добавить agentTaxPercent после изменения типа tax
          },
          vendorAccount: {
            tax: providerTaxValue ?? undefined, //TODO Добавить providerTaxPercent после изменения типа tax
          },
        }
        if (additionalOption.type) {
          acc.push(additionalOption)
        }

        return acc
      },
      [],
    )

    return [...additionalEquipmentForApplication, ...additionalDealerServicesForApplication]
  }, [])

  const getPriceOfAdditionalOptionsInCredit = useCallback((values: FullOrderCalculatorFields) => {
    const equipmentCost = values.additionalEquipments.reduce((acc, option) => {
      if (option[FormFieldNameMap.isCredit]) {
        acc += parseInt(option[FormFieldNameMap.productCost], 10)
      }

      return acc
    }, 0)
    const dealerServicesConst = values.dealerAdditionalServices.reduce((acc, option) => {
      if (option[FormFieldNameMap.isCredit]) {
        acc += parseInt(option[FormFieldNameMap.productCost], 10)
      }

      return acc
    }, 0)

    return equipmentCost + dealerServicesConst
  }, [])

  const remapApplicationValuesForSmallCalculator = useCallback(
    (values: OrderCalculatorFields) => {
      const {
        specialMark,
        carCost,
        carModel,
        carBrand,
        carCondition,
        carMileage,
        carYear,
        initialPayment,
        loanTerm,
        creditProduct,
      } = values

      const fullApplication: GetFullApplicationResponse = fullApplicationData ? fullApplicationData : {}
      const application = fullApplication.application ? fullApplication.application : {}
      const newLoanCar: LoanCarFrontdc = {
        brand: carBrand ?? undefined,
        isCarNew: !!carCondition,
        autoPrice: parseInt(carCost, 10),
        mileage: carMileage,
        model: carModel ?? undefined,
        autoCreateYear: carYear,
      }
      const newLoanData: LoanDataFrontdc = {
        productCode: parseInt(creditProduct, 10),
        downPayment: parseInt(initialPayment, 10),
        term: parseInt(loanTerm.toString(), 10),
        additionalOptions: remapAdditionalOptionsForSmallCalculator(values),
      }
      const updatedApplication = {
        ...application,
        loanCar: newLoanCar,
        loanData: newLoanData,
        specialMark: specialMark ?? undefined,
      }
      dispatch(updateOrder({ orderData: { ...fullApplicationData, application: updatedApplication } }))
    },
    [fullApplicationData, dispatch],
  )

  const remapApplicationValuesForFullCalculator = useCallback(
    (values: FullOrderCalculatorFields) => {
      const {
        carCost,
        carModel,
        carBrand,
        carCondition,
        carMileage,
        carYear,
        initialPayment,
        loanTerm,
        creditProduct,
        carId,
        taxValue,
        taxPercent,
        bankAccountNumber,
        carIdType,
        bankIdentificationCode,
        beneficiaryBank,
        carPassportId,
        carPassportCreationDate,
        correspondentAccount,
        legalPerson,
        loanAmount,
        salesContractDate,
        salesContractId,
      } = values
      const fullApplication: GetFullApplicationResponse = fullApplicationData ? fullApplicationData : {}
      const application = fullApplication.application ? fullApplication.application : {}
      const newLoanCar: LoanCarFrontdc = {
        brand: carBrand ?? undefined,
        isCarNew: !!carCondition,
        autoPrice: parseInt(carCost, 10),
        mileage: carMileage,
        model: carModel ?? undefined,
        autoCreateYear: carYear,
        ptsNumber: carPassportId,
        ptsDate: convertedDateToString(carPassportCreationDate),
        vinNumber: carIdType === 1 ? carId : undefined,
        carBody: carIdType === 0 ? carId : undefined,
        dkpNumber: salesContractId,
        dkpDate: convertedDateToString(salesContractDate),
      }
      const newVendor: VendorFrontdc = {
        vendorCode: legalPerson,
        vendorBankDetails: {
          bank: beneficiaryBank,
          bic: bankIdentificationCode,
          accountNumber: bankAccountNumber,
          accountCorrNumber: correspondentAccount,
          tax: taxValue ?? undefined, //TODO Добавить taxPercent после изменения типа tax
        },
      }
      const newLoanData: LoanDataFrontdc = {
        productCode: parseInt(creditProduct, 10),
        downPayment: parseInt(initialPayment, 10),
        term: parseInt(loanTerm.toString(), 10),
        amountWithoutAdd: parseInt(loanAmount, 10),
        amount: getPriceOfAdditionalOptionsInCredit(values) + parseInt(loanAmount, 10),
        additionalOptions: remapAdditionalOptionsForFullCalculator(values),
      }

      const updatedApplication = {
        ...application,
        loanCar: newLoanCar,
        loanData: newLoanData,
        vendor: newVendor,
        specialMark: application.specialMark,
      }

      dispatch(updateOrder({ orderData: { ...fullApplicationData, application: updatedApplication } }))
    },
    [fullApplicationData, dispatch],
  )

  const remapApplicationValues = useCallback(
    (values: OrderCalculatorFields | FullOrderCalculatorFields) => {
      if (isFullCalculator) {
        remapApplicationValuesForFullCalculator(values as FullOrderCalculatorFields)
      } else {
        remapApplicationValuesForSmallCalculator(values as OrderCalculatorFields)
      }
    },
    [isFullCalculator, remapApplicationValuesForSmallCalculator, remapApplicationValuesForFullCalculator],
  )

  return {
    remapApplicationValues,
    hasCustomInitialValues: !!fullApplicationData?.application,
    initialValues: fullApplicationData?.application
      ? ({
          [FormFieldNameMap.carCondition]: loanCar?.isCarNew ?? initialData.carCondition ? 1 : 0,
          [FormFieldNameMap.carBrand]: loanCar?.brand ?? initialData.carBrand,
          [FormFieldNameMap.carModel]: loanCar?.model ?? initialData.carModel,
          [FormFieldNameMap.carYear]: loanCar?.autoCreateYear ?? initialData.carYear,
          [FormFieldNameMap.carCost]: `${loanCar?.autoPrice ?? initialData.carCost}`,
          [FormFieldNameMap.carMileage]: loanCar?.mileage ?? initialData.carMileage,
          [FormFieldNameMap.creditProduct]: loanData?.productCode ?? initialData.creditProduct,
          [FormFieldNameMap.initialPayment]: `${loanData?.downPayment ?? initialData.initialPayment}`,
          [FormFieldNameMap.initialPaymentPercent]: initialData.initialPaymentPercent,
          [FormFieldNameMap.loanTerm]: loanData?.term ?? initialData.loanTerm,

          ...calculatorValuesPart,

          [ServicesGroupName.additionalEquipments]: additionalEquipments,
          [ServicesGroupName.dealerAdditionalServices]: dealerAdditionalServices,
          [ServicesGroupName.bankAdditionalServices]: bankAdditionalServices,

          [FormFieldNameMap.commonError]: initialData.commonError,
          [FormFieldNameMap.validationParams]: initialData.validationParams,
        } as CalculatorFields<D>)
      : initialData,
  }
}
