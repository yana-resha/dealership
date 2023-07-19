import { useCallback, useEffect, useRef, useState } from 'react'

import { CalculateCreditRequest, CalculatedProduct } from '@sberauto/dictionarydc-proto/public'
import { LoanDataFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { updateOrder } from 'entities/reduxStore/orderSlice'
import { useCalculateCreditMutation } from 'shared/api/requests/dictionaryDc.api'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

export function useOrderSettings(nextStep: () => void, onChangeForm: () => void) {
  const dispatch = useAppDispatch()
  const orderData = useAppSelector(state => state.order.order)?.orderData
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
    (creditProduct: CalculatedProduct) => {
      const loanData: LoanDataFrontdc = {
        ...orderData?.application?.loanData,
        productFamilyCode: creditProduct.productCodeName,
        productId: creditProduct.productId ?? orderData?.application?.loanData?.productId,
        // TODO раскомментировать после обновления контрактов
        productCode: /* creditProduct.productCode ?? */ orderData?.application?.loanData?.productCode,
        productName: creditProduct.productName ?? orderData?.application?.loanData?.productName,
        downPayment: creditProduct.downpayment ?? orderData?.application?.loanData?.downPayment,
        term: creditProduct.term ?? orderData?.application?.loanData?.term,
        monthlyPayment: creditProduct.monthlyPayment ?? orderData?.application?.loanData?.monthlyPayment,
        cascoFlag: creditProduct.cascoFlag ?? orderData?.application?.loanData?.cascoFlag,
        productRates: {
          ...orderData?.application?.loanData?.productRates,
          baseRate: creditProduct.currentRate ?? orderData?.application?.loanData?.productRates?.baseRate,
        },
        incomeFlag: creditProduct.incomeFlag ?? orderData?.application?.loanData?.incomeFlag,
        amount: creditProduct.totalSum ?? orderData?.application?.loanData?.amount,
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
