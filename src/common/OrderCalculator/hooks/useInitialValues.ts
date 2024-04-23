import { useMemo } from 'react'

import { OptionType } from '@sberauto/loanapplifecycledc-proto/public'

import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { checkIsNumber } from 'shared/lib/helpers'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { CAR_PASSPORT_TYPE, INITIAL_CAR_ID_TYPE } from '../config'
import { BriefOrderCalculatorFields, FormFieldNameMap, FullOrderCalculatorFields } from '../types'

type CalculatorFields<D> = D extends boolean ? FullOrderCalculatorFields : BriefOrderCalculatorFields

export function useInitialValues<D extends boolean | undefined>(
  initialData: CalculatorFields<D>,
  isFullCalculator?: D,
) {
  const initialOrder = useAppSelector(state => state.order.order)

  const application = useMemo(
    () => initialOrder?.orderData?.application || {},
    [initialOrder?.orderData?.application],
  )

  const { loanCar, loanData, vendor } = useMemo(() => application, [application])

  const { additionalEquipments, dealerAdditionalServices, bankAdditionalServices } = useMemo(
    () =>
      (loanData?.additionalOptions || []).reduce(
        (acc, cur) => {
          if (cur.bankOptionType === null || cur.bankOptionType === undefined) {
            return acc
          }

          const additionalServiceBaseData = {
            [FormFieldNameMap.productType]: cur.type ?? initialData.additionalEquipments[0].productType,
            [FormFieldNameMap.productCost]: `${cur.price ?? initialData.additionalEquipments[0].productCost}`,
            [FormFieldNameMap.isCredit]: cur.inCreditFlag ?? initialData.additionalEquipments[0].isCredit,
            [FormFieldNameMap.cascoLimit]: `${
              cur.cascoLimit ?? initialData.additionalEquipments[0].cascoLimit
            }`,
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
                  cur.broker?.requisites?.accountRequisite?.bic ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].bankIdentificationCode,
                [FormFieldNameMap.beneficiaryBank]:
                  cur.broker?.requisites?.accountRequisite?.bank ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].beneficiaryBank,
                [FormFieldNameMap.bankAccountNumber]:
                  cur.broker?.requisites?.accountRequisite?.accountNumber ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].bankAccountNumber,
                [FormFieldNameMap.isCustomFields]:
                  cur.broker?.requisites?.accountRequisite?.accManualEnter ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].isCustomFields,
                [FormFieldNameMap.correspondentAccount]:
                  cur.broker?.requisites?.accountRequisite?.accountCorrNumber ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].correspondentAccount,
                [FormFieldNameMap.taxation]: `${
                  cur.broker?.taxInfo?.amount ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].taxation
                }`,
              }
            : {}

          const dealerAdditionalServiceData = isFullCalculator
            ? {
                [FormFieldNameMap.provider]:
                  stringToNumber(cur.vendor?.vendorCode) ??
                  (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].provider,
                [FormFieldNameMap.broker]:
                  stringToNumber(cur.broker?.vendorCode) ??
                  (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].broker,
                [FormFieldNameMap.loanTerm]:
                  cur.term ?? (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].loanTerm,
                [FormFieldNameMap.cascoLimit]: cur.cascoLimit
                  ? `${cur.cascoLimit}`
                  : (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].cascoLimit,
                [FormFieldNameMap.taxValue]: (initialData as FullOrderCalculatorFields)
                  .dealerAdditionalServices[0].taxValue,
                [FormFieldNameMap.taxPercent]: (initialData as FullOrderCalculatorFields)
                  .dealerAdditionalServices[0].taxPercent,
              }
            : {
                [FormFieldNameMap.cascoLimit]: cur.cascoLimit
                  ? `${cur.cascoLimit}`
                  : (initialData as FullOrderCalculatorFields).dealerAdditionalServices[0].cascoLimit,
              }

          switch (cur.bankOptionType) {
            case OptionType.EQUIPMENT: {
              if (
                acc.additionalEquipments.length === 1 &&
                !checkIsNumber(acc.additionalEquipments[0].productType)
              ) {
                acc.additionalEquipments.shift()
              }
              acc.additionalEquipments.push({
                ...additionalServiceBaseData,
                ...initialAdditionalServiceDocInfo,
                [FormFieldNameMap.broker]:
                  stringToNumber(cur.broker?.vendorCode) ??
                  (initialData as FullOrderCalculatorFields).additionalEquipments[0].broker,
                ...additionalServiceRequisitesData,
                ...additionalEquipmentsData,
              })
              break
            }
            case OptionType.DEALER: {
              if (
                acc.dealerAdditionalServices.length === 1 &&
                !checkIsNumber(acc.dealerAdditionalServices[0].productType)
              ) {
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
            case OptionType.BANK: {
              if (
                acc.bankAdditionalServices.length === 1 &&
                !checkIsNumber(acc.bankAdditionalServices[0].productType)
              ) {
                acc.bankAdditionalServices.shift()
              }
              acc.bankAdditionalServices.push({
                [FormFieldNameMap.productType]: cur.type ?? initialData.bankAdditionalServices[0].productType,
                [FormFieldNameMap.productCost]: `${
                  cur.price ?? initialData.bankAdditionalServices[0].productCost
                }`,
                [FormFieldNameMap.tariff]: cur.tariffId ?? initialData.bankAdditionalServices[0].tariff,
                [FormFieldNameMap.loanTerm]: cur.term ?? initialData.bankAdditionalServices[0].loanTerm,
                ...dealerAdditionalServiceData,
              })
              break
            }
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
        [FormFieldNameMap.carPassportType]: loanCar?.ptsNumber
          ? loanCar.ptsNumber.length === 10
            ? CAR_PASSPORT_TYPE[1].value
            : CAR_PASSPORT_TYPE[0].value
          : (initialData as FullOrderCalculatorFields).carPassportType,
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
        [FormFieldNameMap.legalPersonCode]:
          stringToNumber(vendor?.broker?.vendorCode) ??
          (initialData as FullOrderCalculatorFields).legalPersonCode,
        [FormFieldNameMap.loanAmount]: `${
          loanData?.amount ?? (initialData as FullOrderCalculatorFields).loanAmount
        }`,
        [FormFieldNameMap.bankIdentificationCode]:
          vendor?.broker?.requisites?.accountRequisite?.bic ??
          (initialData as FullOrderCalculatorFields).bankIdentificationCode,
        [FormFieldNameMap.beneficiaryBank]:
          vendor?.broker?.requisites?.accountRequisite?.bank ??
          (initialData as FullOrderCalculatorFields).beneficiaryBank,
        [FormFieldNameMap.bankAccountNumber]:
          vendor?.broker?.requisites?.accountRequisite?.accountNumber ??
          (initialData as FullOrderCalculatorFields).bankAccountNumber,
        [FormFieldNameMap.isCustomFields]:
          vendor?.broker?.requisites?.accountRequisite?.accManualEnter ??
          (initialData as FullOrderCalculatorFields).isCustomFields,
        [FormFieldNameMap.correspondentAccount]:
          vendor?.broker?.requisites?.accountRequisite?.accountCorrNumber ??
          (initialData as FullOrderCalculatorFields).correspondentAccount,
        [FormFieldNameMap.taxation]:
          `${
            vendor?.broker?.taxInfo?.amount ?? ((initialData as FullOrderCalculatorFields).taxation || '')
          }` || undefined,
        [FormFieldNameMap.taxPresence]: !!vendor?.broker?.taxInfo?.amount,
        [FormFieldNameMap.taxPercent]: (initialData as FullOrderCalculatorFields).taxPercent,
        [FormFieldNameMap.taxValue]: (initialData as FullOrderCalculatorFields).taxValue,
      }
    : {}

  return {
    hasCustomInitialValues: !!application?.loanCar,
    initialValues: application
      ? ({
          [FormFieldNameMap.carCondition]: loanCar?.isCarNew ?? initialData.carCondition ? 1 : 0,
          [FormFieldNameMap.carBrand]: loanCar?.brand ?? initialData.carBrand,
          [FormFieldNameMap.carModel]: loanCar?.model ?? initialData.carModel,
          [FormFieldNameMap.carYear]: loanCar?.autoCreateYear ?? initialData.carYear,
          [FormFieldNameMap.carCost]: `${loanCar?.autoPrice ?? initialData.carCost}`,
          [FormFieldNameMap.carMileage]: loanCar?.mileage ?? initialData.carMileage,
          [FormFieldNameMap.creditProduct]: loanData?.productId ?? initialData.creditProduct,
          [FormFieldNameMap.initialPayment]: `${loanData?.downpayment ?? initialData.initialPayment}`,
          [FormFieldNameMap.initialPaymentPercent]: `${
            loanData?.downpaymentInPercent ?? initialData.initialPaymentPercent
          }`,
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
