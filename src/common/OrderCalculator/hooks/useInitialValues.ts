import { useMemo } from 'react'

import { BankOptionType } from '@sberauto/loanapplifecycledc-proto/public'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetFullApplicationQuery } from 'shared/api/requests/loanAppLifeCycleDc'
import { ApplicationFrontDc } from 'shared/api/requests/loanAppLifeCycleDc.mock'

import { CAR_PASSPORT_TYPE, INITIAL_CAR_ID_TYPE } from '../config'
import { FormFieldNameMap, FullOrderCalculatorFields, OrderCalculatorFields } from '../types'

type CalculatorFields<D> = D extends boolean ? FullOrderCalculatorFields : OrderCalculatorFields
export function useInitialValues<D extends boolean | undefined>(
  initialData: CalculatorFields<D>,
  applicationId?: string,
  isFullCalculator?: D,
) {
  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: fullApplicationData, isLoading } = useGetFullApplicationQuery(
    { applicationId },
    { enabled: !!applicationId },
  )

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
          }
          const additionalServiceRequisitesData = isFullCalculator
            ? {
                [FormFieldNameMap.bankIdentificationCode]:
                  cur.vendorAccount?.bic ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].bankIdentificationCode,
                [FormFieldNameMap.beneficiaryBank]:
                  cur.vendorAccount?.bank ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].beneficiaryBank,
                [FormFieldNameMap.bankAccountNumber]:
                  cur.vendorAccount?.accountNumber ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].bankAccountNumber,
                [FormFieldNameMap.isCustomFields]:
                  cur.vendorAccount?.accManualEnter ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].isCustomFields,
                [FormFieldNameMap.correspondentAccount]:
                  cur.vendorAccount?.accountCorrNumber ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].correspondentAccount,
                [FormFieldNameMap.taxation]: `${
                  cur.vendorAccount?.tax ??
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
                [FormFieldNameMap.documentId]:
                  cur.docNumber ??
                  (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].documentId,
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

  return {
    isShouldShowLoading: applicationId && isLoading,
    hasCustomInitialValues: !!applicationId,
    initialValues: applicationId
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
