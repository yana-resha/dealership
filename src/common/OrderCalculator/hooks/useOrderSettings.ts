import { useCallback, useEffect, useRef, useState } from 'react'

import {
  CalculateCreditRequest,
  CalculatedProduct,
  RequiredServiceFlag,
} from '@sberauto/dictionarydc-proto/public'
import { LoanDataFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'

import { updateApplication, updateFillingProgress } from 'entities/order'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'
import { useCalculateCreditMutation } from 'shared/api/requests/dictionaryDc.api'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { useOrderContext } from '../ui/OrderContext'

export function useOrderSettings(nextStep: () => void) {
  const dispatch = useAppDispatch()
  const initialOrder = useAppSelector(state => state.order.order)
  const orderData = initialOrder?.orderData
  const productsMap = initialOrder?.productsMap

  const { enqueueSnackbar } = useSnackbar()

  const [bankOffers, setBankOffers] = useState<CalculatedProduct[] | null>(null)
  const [creditProductId, setCreditProductId] = useState<string>()
  const {
    mutate: calculateCreditMutate,
    isError: isOfferError,
    isLoading: isOfferLoading,
  } = useCalculateCreditMutation()

  const { onChangeForm } = useOrderContext()

  const clearBankOfferList = useCallback(() => {
    if (!bankOffers) {
      return
    }
    setBankOffers(null)
  }, [bankOffers])

  const handleFormChange = useCallback(
    (saveValuesToStore: () => void) => {
      clearBankOfferList()
      dispatch(updateFillingProgress({ isFilledLoanData: false }))
      onChangeForm(saveValuesToStore)
    },
    [clearBankOfferList, dispatch, onChangeForm],
  )

  const resetCreditProductId = useCallback(() => setCreditProductId(undefined), [])

  const calculateCredit = useCallback(
    async (data: CalculateCreditRequest, onSuccess: () => void) =>
      calculateCreditMutate(data, {
        onSuccess: res => {
          if (res.products) {
            setBankOffers(res.products)
            onSuccess()
          }
        },
        onError: err => {
          enqueueSnackbar(
            getErrorMessage({
              service: Service.Dictionarydc,
              serviceApi: ServiceApi.CALCULATE_CREDIT,
              code: err.code as ErrorCode,
              alias: err.alias as ErrorAlias,
            }),
            { variant: 'error' },
          )
        },
      }),
    [enqueueSnackbar, calculateCreditMutate],
  )

  const handleCreditProductClick = useCallback(
    (bankOffer: CalculatedProduct) => {
      const creditProduct = productsMap?.[`${bankOffer.productId}`]
      const condition = creditProduct?.conditions?.find(c => c.id === bankOffer.conditionId)

      if (bankOffer.requiredServiceFlag === RequiredServiceFlag.REQUIRED) {
        clearBankOfferList()
        setCreditProductId(bankOffer.productId)

        return
      }

      const additionalOptions = orderData?.application?.loanData?.additionalOptions?.map(option => ({
        ...option,
        rateDelta: option.type === bankOffer.rateDeltaOptionId ? bankOffer.rateDelta : undefined,
      }))

      const loanData: LoanDataFrontdc = {
        ...orderData?.application?.loanData,
        additionalOptions,
        productId: bankOffer.productId ?? orderData?.application?.loanData?.productId,
        productCode: creditProduct?.productCode,
        productCodeName: bankOffer?.productCodeName,
        productName: bankOffer?.productName,
        monthlyPayment: bankOffer?.monthlyPayment,
        dateStart: creditProduct?.activeDateFrom,
        dateEnd: creditProduct?.activeDateTo,
        crMinValue: condition?.crMinValue,
        crMaxValue: condition?.crMaxValue,
        crMinDuration: condition?.durationMin,
        crMaxDuration: condition?.durationMax,
        npllzp: creditProduct?.npllzp,
        npllzak: creditProduct?.npllzak,
        approvalValidity: creditProduct?.approvalValidity,
        termsLoanCode: creditProduct?.termsLoanCode,
        downpayment: bankOffer?.downpayment,
        term: bankOffer?.term,
        amount: bankOffer?.amountWithoutPercent,
        amountWithoutOptions: bankOffer?.amountWithoutOptions,
        incomeProduct: bankOffer?.incomeFlag,
        productRates: {
          baseRate: bankOffer?.currentRate,
          rateGrntyPeriod: condition?.rateGrntyPeriod,
          rateNewGrnty: condition?.rateNewGrnty,
          rateNonGrnty: condition?.rateNonGrnty,
        },
        overpayment: bankOffer.overpayment,
        pskPrc: bankOffer.pskPrc,
        govprogramDiscount: bankOffer?.discountGovprogram,
        prodSubsidy: creditProduct?.prodSubsidy,
      }

      dispatch(updateFillingProgress({ isFilledLoanData: true }))
      dispatch(updateApplication({ loanData }))

      nextStep()
    },
    [clearBankOfferList, dispatch, nextStep, orderData?.application?.loanData, productsMap],
  )

  useEffect(() => {
    if (isOfferError) {
      clearBankOfferList()
    }
  }, [isOfferError, clearBankOfferList])

  const bankOffersRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (bankOffersRef.current) {
      bankOffersRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [bankOffers?.length])

  return {
    isOfferError,
    isOfferLoading,
    bankOffers,
    bankOffersRef,
    calculateCredit,
    handleFormChange,
    handleCreditProductClick,
    creditProductId,
    resetCreditProductId,
  }
}
