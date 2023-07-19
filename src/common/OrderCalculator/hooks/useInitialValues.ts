import { useCallback, useMemo } from 'react'

import {
  AdditionalOptionsFrontdc,
  OptionType,
  GetFullApplicationResponse,
  LoanCarFrontdc,
  LoanDataFrontdc,
  VendorFrontdc,
} from '@sberauto/loanapplifecycledc-proto/public'
import { ApplicationFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { useDispatch } from 'react-redux'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { updateOrder } from 'entities/reduxStore/orderSlice'
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
    () => fullApplicationData?.application || ({} as ApplicationFrontdc),
    [fullApplicationData?.application],
  )

  const { additionalEquipments, dealerAdditionalServices, bankAdditionalServices } = useMemo(
    () =>
      (loanData?.additionalOptions || []).reduce(
        (acc, cur) => {
          if (!cur.bankOptionType && cur.bankOptionType !== OptionType.BANK) {
            return acc
          }

          const additionalServiceBaseData = {
            [FormFieldNameMap.productType]: cur.type ?? initialData.additionalEquipments[0].productType,
            [FormFieldNameMap.productCost]: `${cur.price ?? initialData.additionalEquipments[0].productCost}`,
            [FormFieldNameMap.isCredit]: cur.inCreditFlag ?? initialData.additionalEquipments[0].isCredit,
          }
          const initialAdditionalServiceDocInfo = isFullCalculator
            ? {
                [FormFieldNameMap.documentType]:
                  cur.docType ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].documentType,
                [FormFieldNameMap.documentNumber]:
                  cur.docNumber ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].documentNumber,
                [FormFieldNameMap.documentDate]: cur.docDate
                  ? new Date(cur.docDate)
                  : (initialData as FullOrderCalculatorFields).additionalEquipments[0].documentDate,
              }
            : {}
          const additionalEquipmentsData = isFullCalculator
            ? {
                [FormFieldNameMap.taxPercent]: (initialData as FullOrderCalculatorFields)
                  .additionalEquipments[0].taxPercent,
                [FormFieldNameMap.taxValue]: (initialData as FullOrderCalculatorFields)
                  .additionalEquipments[0].taxValue,
              }
            : {}
          const additionalServiceRequisitesData = isFullCalculator
            ? {
                [FormFieldNameMap.bankIdentificationCode]:
                  cur.bankOptionType === OptionType.DEALER
                    ? cur.broker?.requisites?.accountRequisite?.bic
                    : cur.vendor?.requisites?.accountRequisite?.bic ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0]
                        .bankIdentificationCode,
                [FormFieldNameMap.beneficiaryBank]:
                  cur.bankOptionType === OptionType.DEALER
                    ? cur.broker?.requisites?.accountRequisite?.bank
                    : cur.vendor?.requisites?.accountRequisite?.bank ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].beneficiaryBank,
                [FormFieldNameMap.bankAccountNumber]:
                  cur.bankOptionType === OptionType.DEALER
                    ? cur.broker?.requisites?.accountRequisite?.accountNumber
                    : cur.vendor?.requisites?.accountRequisite?.accountNumber ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].bankAccountNumber,
                [FormFieldNameMap.isCustomFields]:
                  cur.bankOptionType === OptionType.DEALER
                    ? cur.broker?.requisites?.accountRequisite?.accManualEnter
                    : cur.vendor?.requisites?.accountRequisite?.accManualEnter ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].isCustomFields,
                [FormFieldNameMap.correspondentAccount]:
                  cur.bankOptionType === OptionType.DEALER
                    ? cur.broker?.requisites?.accountRequisite?.accountCorrNumber
                    : cur.vendor?.requisites?.accountRequisite?.accountCorrNumber ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].correspondentAccount,
                [FormFieldNameMap.taxation]: `${
                  cur.bankOptionType === OptionType.DEALER
                    ? cur.broker?.taxInfo?.amount
                    : cur.vendor?.taxInfo?.amount ??
                      (initialData as FullOrderCalculatorFields).additionalEquipments[0].taxation
                }`,
              }
            : {}
          const dealerAdditionalServiceData = isFullCalculator
            ? {
                [FormFieldNameMap.provider]:
                  cur.vendor?.vendorCode ??
                  (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].provider,
                [FormFieldNameMap.agent]:
                  cur.broker?.vendorCode ??
                  (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].agent,
                [FormFieldNameMap.loanTerm]:
                  cur.term ?? (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].loanTerm,
                [FormFieldNameMap.providerTaxValue]: (initialData as FullOrderCalculatorFields)
                  .dealerAdditionalServices[0].providerTaxValue,
                [FormFieldNameMap.providerTaxPercent]: (initialData as FullOrderCalculatorFields)
                  .dealerAdditionalServices[0].providerTaxPercent,
                [FormFieldNameMap.agentTaxValue]: (initialData as FullOrderCalculatorFields)
                  .dealerAdditionalServices[0].agentTaxValue,
                [FormFieldNameMap.agentTaxPercent]: (initialData as FullOrderCalculatorFields)
                  .dealerAdditionalServices[0].agentTaxPercent,
              }
            : {}

          switch (cur.bankOptionType) {
            case OptionType.EQUIPMENT: {
              if (acc.additionalEquipments.length === 1 && !acc.additionalEquipments[0].productType) {
                acc.additionalEquipments.shift()
              }
              acc.additionalEquipments.push({
                ...additionalServiceBaseData,
                ...initialAdditionalServiceDocInfo,
                [FormFieldNameMap.legalPerson]:
                  cur.vendor?.vendorCode ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].legalPerson,
                ...additionalServiceRequisitesData,
                ...additionalEquipmentsData,
              })
              break
            }
            case OptionType.DEALER: {
              if (acc.dealerAdditionalServices.length === 1 && !acc.dealerAdditionalServices[0].productType) {
                acc.dealerAdditionalServices.shift()
              }
              acc.dealerAdditionalServices.push({
                ...additionalServiceBaseData,
                ...initialAdditionalServiceDocInfo,
                ...dealerAdditionalServiceData,
                ...additionalServiceRequisitesData,
              })
              break
            }
            // case OptionType.BANK: {
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
          loanCar?.vinNumber || loanCar?.carBody || (initialData as FullOrderCalculatorFields).carId,
        [FormFieldNameMap.salesContractId]:
          loanCar?.dkpNumber ?? (initialData as FullOrderCalculatorFields).salesContractId,
        [FormFieldNameMap.salesContractDate]: loanCar?.dkpDate
          ? new Date(loanCar.dkpDate)
          : (initialData as FullOrderCalculatorFields).salesContractDate,
        [FormFieldNameMap.legalPerson]:
          vendor?.vendorCode ?? vendorCode ?? (initialData as FullOrderCalculatorFields).legalPerson,
        [FormFieldNameMap.loanAmount]: `${
          loanData?.amountWithoutOptions ?? (initialData as FullOrderCalculatorFields).loanAmount
        }`,
        [FormFieldNameMap.bankIdentificationCode]:
          vendor?.vendorBankDetails?.accountRequisite?.bic ??
          (initialData as FullOrderCalculatorFields).bankIdentificationCode,
        [FormFieldNameMap.beneficiaryBank]:
          vendor?.vendorBankDetails?.accountRequisite?.bank ??
          (initialData as FullOrderCalculatorFields).beneficiaryBank,
        [FormFieldNameMap.bankAccountNumber]:
          vendor?.vendorBankDetails?.accountRequisite?.accountNumber ??
          (initialData as FullOrderCalculatorFields).bankAccountNumber,
        [FormFieldNameMap.isCustomFields]:
          vendor?.vendorBankDetails?.accountRequisite?.accManualEnter ??
          (initialData as FullOrderCalculatorFields).isCustomFields,
        [FormFieldNameMap.correspondentAccount]:
          vendor?.vendorBankDetails?.accountRequisite?.accountCorrNumber ??
          (initialData as FullOrderCalculatorFields).correspondentAccount,
        [FormFieldNameMap.taxation]:
          `${vendor?.taxInfo?.amount ?? ((initialData as FullOrderCalculatorFields).taxation || '')}` ||
          undefined,
        [FormFieldNameMap.taxPercent]: (initialData as FullOrderCalculatorFields).taxPercent,
        [FormFieldNameMap.taxValue]: (initialData as FullOrderCalculatorFields).taxValue,
      }
    : {
        [FormFieldNameMap.specialMark]: specialMark ?? (initialData as OrderCalculatorFields).specialMark,
      }

  const remapAdditionalOptionsForSmallCalculator = useCallback((values: OrderCalculatorFields) => {
    const { additionalEquipments, dealerAdditionalServices } = values
    const additionalOptionsFromCalculator = [additionalEquipments, dealerAdditionalServices]
    const additionalOptionsForApplication: AdditionalOptionsFrontdc[] = []
    for (let i = 0; i < additionalOptionsFromCalculator.length; i++) {
      const additionalOption = additionalOptionsFromCalculator[i]
      const additionalOptionForApplication = additionalOption.reduce(
        (acc: AdditionalOptionsFrontdc[], option) => {
          const { productCost, productType, isCredit, cascoLimit } = option
          const additionalOption: AdditionalOptionsFrontdc = {
            bankOptionType: i === 0 ? OptionType.EQUIPMENT : OptionType.DEALER,
            type: parseInt(productType.toString(), 10) ?? undefined,
            inCreditFlag: isCredit,
            price: parseInt(productCost, 10),
            cascoLimit: cascoLimit ? parseInt(cascoLimit, 10) : undefined,
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
      (acc: AdditionalOptionsFrontdc[], option) => {
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
          cascoLimit,
        } = option

        const additionalOption: AdditionalOptionsFrontdc = {
          bankOptionType: OptionType.EQUIPMENT,
          type: parseInt(productType.toString(), 10) ?? undefined,
          inCreditFlag: isCredit,
          price: parseInt(productCost, 10),
          vendor: {
            vendorCode: legalPerson,
            requisites: {
              accountRequisite: {
                accountNumber: bankAccountNumber,
                accountCorrNumber: correspondentAccount,
                bank: beneficiaryBank,
                bic: bankIdentificationCode,
              },
            },
            taxInfo: {
              amount: taxValue ?? undefined,
              percent: taxPercent ?? undefined,
            },
          },
          docType: documentType,
          docNumber: documentNumber,
          docDate: convertedDateToString(documentDate),
          cascoLimit: cascoLimit ? parseInt(cascoLimit, 10) : undefined,
        }
        if (additionalOption.type) {
          acc.push(additionalOption)
        }

        return acc
      },
      [],
    )

    const additionalDealerServicesForApplication = dealerAdditionalServices.reduce(
      (acc: AdditionalOptionsFrontdc[], option) => {
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
          cascoLimit,
        } = option
        const additionalOption: AdditionalOptionsFrontdc = {
          bankOptionType: OptionType.DEALER,
          vendor: {
            vendorCode: provider,
            taxInfo: {
              amount: providerTaxValue ?? undefined,
              percent: providerTaxPercent ?? undefined,
            },
          },
          broker: {
            vendorCode: agent,
            requisites: {
              accountRequisite: {
                accountNumber: bankAccountNumber,
                accountCorrNumber: correspondentAccount,
                bank: beneficiaryBank,
                bic: bankIdentificationCode,
              },
            },
            taxInfo: {
              amount: agentTaxValue ?? undefined,
              percent: agentTaxPercent ?? undefined,
            },
          },
          type: parseInt(productType.toString(), 10) ?? undefined,
          inCreditFlag: isCredit,
          price: parseInt(productCost, 10),
          term: loanTerm,
          docType: documentType,
          docNumber: documentNumber,
          docDate: convertedDateToString(documentDate),
          cascoLimit: cascoLimit ? parseInt(cascoLimit, 10) : undefined,
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
        productId: creditProduct,
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
    [fullApplicationData, remapAdditionalOptionsForSmallCalculator, dispatch],
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
          accountRequisite: {
            bank: beneficiaryBank,
            bic: bankIdentificationCode,
            accountNumber: bankAccountNumber,
            accountCorrNumber: correspondentAccount,
          },
        },
        taxInfo: {
          amount: taxValue ?? undefined,
          percent: taxPercent ?? undefined,
        },
      }
      const newLoanData: LoanDataFrontdc = {
        productId: creditProduct,
        downPayment: parseInt(initialPayment, 10),
        term: parseInt(loanTerm.toString(), 10),
        amountWithoutOptions: parseInt(loanAmount, 10),
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
    [
      fullApplicationData,
      getPriceOfAdditionalOptionsInCredit,
      remapAdditionalOptionsForFullCalculator,
      dispatch,
    ],
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
    hasCustomInitialValues: !!fullApplicationData?.application?.loanCar,
    initialValues: fullApplicationData?.application
      ? ({
          [FormFieldNameMap.carCondition]: loanCar?.isCarNew ?? initialData.carCondition ? 1 : 0,
          [FormFieldNameMap.carBrand]: loanCar?.brand ?? initialData.carBrand,
          [FormFieldNameMap.carModel]: loanCar?.model ?? initialData.carModel,
          [FormFieldNameMap.carYear]: loanCar?.autoCreateYear ?? initialData.carYear,
          [FormFieldNameMap.carCost]: `${loanCar?.autoPrice ?? initialData.carCost}`,
          [FormFieldNameMap.carMileage]: loanCar?.mileage ?? initialData.carMileage,
          [FormFieldNameMap.creditProduct]: loanData?.productId ?? initialData.creditProduct,
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
