import { useCallback, useEffect, useRef, useState } from 'react'

import { CalculateCreditRequest, CalculatedProduct } from '@sberauto/dictionarydc-proto/public'
import { LoanDataFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { updateOrder } from 'entities/reduxStore/orderSlice'
import { useCalculateCreditMutation } from 'shared/api/requests/dictionaryDc.api'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

export function useOrderSettings(nextStep: () => void, onChangeForm: () => void) {
  const dispatch = useAppDispatch()
  const initialOrder = useAppSelector(state => state.order.order)
  const orderData = initialOrder?.orderData
  const creditProductsList = initialOrder?.creditProductsList
  const [bankOffers, setBankOffers] = useState<CalculatedProduct[] | null>(null)

  const { mutateAsync, isError: isOfferError, isLoading: isOfferLoading } = useCalculateCreditMutation()

  const clearBankOfferList = useCallback(() => {
    if (!bankOffers) {
      return
    }
    setBankOffers(null)
  }, [bankOffers])

  const handleFormChange = useCallback(() => {
    clearBankOfferList()
    onChangeForm()
  }, [clearBankOfferList, onChangeForm])

  const calculateCredit = useCallback(
    async (data: CalculateCreditRequest) => {
      const res = await mutateAsync(data)
      if (res && res.products) {
        setBankOffers(res.products)
      }
    },
    [mutateAsync],
  )

  const handleCreditProductClick = useCallback(
    (bankOffer: CalculatedProduct) => {
      const creditProduct = creditProductsList?.find(product => product.productId === bankOffer.productId)
      const loanData: LoanDataFrontdc = {
        ...orderData?.application?.loanData,
        productId: bankOffer.productId ?? orderData?.application?.loanData?.productId,
        productCode: creditProduct?.productCode,
        productCodeName: bankOffer?.productCodeName,
        productName: bankOffer?.productName,
        monthlyPayment: bankOffer?.monthlyPayment,
        dateStart: creditProduct?.activeDateFrom,
        dateEnd: creditProduct?.activeDateFrom,
        crMinValue: creditProduct?.crMinValue,
        crMaxValue: creditProduct?.crMaxValue,
        crMinDuration: creditProduct?.durationMin,
        crMaxDuration: creditProduct?.durationMax,
        npllzp: creditProduct?.npllzp,
        npllzak: creditProduct?.npllzak,
        approvalValidity: creditProduct?.approvalValidity,
        termsLoanCode: creditProduct?.termsLoanCode,
        downpayment: bankOffer?.downpayment,
        term: bankOffer?.term,
        amount: bankOffer?.totalSum,
        cascoInProduct: bankOffer?.cascoFlag,
        incomeProduct: bankOffer?.incomeFlag,
        productRates: {
          baseRate: creditProduct?.baseRate,
          baseRateNew: creditProduct?.baseRateNew,
          baseRateOld: creditProduct?.baseRateOld,
          rateNewGrnty: creditProduct?.rateNewGrnty,
          rateNonGrnty: creditProduct?.rateNonGrnty,
          rateDiscountCpi: creditProduct?.rateDiscountCpi,
          ratePenaltyCasco: creditProduct?.ratePenaltyCasco,
        },
      }
      dispatch(
        updateOrder({ orderData: { ...orderData, application: { ...orderData?.application, loanData } } }),
      )

      nextStep()
    },
    [dispatch, nextStep, orderData],
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
  }
}