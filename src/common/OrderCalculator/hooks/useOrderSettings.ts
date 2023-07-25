import { useCallback, useEffect, useRef, useState } from 'react'

import { CalculateCreditRequest, CalculatedProduct } from '@sberauto/dictionarydc-proto/public'
import { LoanDataFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { updateOrder } from 'entities/reduxStore/orderSlice'
import { useCalculateCreditMutation } from 'shared/api/requests/dictionaryDc.api'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { useOrderContext } from '../ui/OrderContext'

export function useOrderSettings(nextStep: () => void, onChangeForm: () => void) {
  const dispatch = useAppDispatch()
  const initialOrder = useAppSelector(state => state.order.order)
  const orderData = initialOrder?.orderData
  const creditProductsList = initialOrder?.creditProductsList
  const [bankOffers, setBankOffers] = useState<CalculatedProduct[] | null>(null)
  const { mutateAsync, isError: isOfferError, isLoading: isOfferLoading } = useCalculateCreditMutation()

  const { scrolContainer } = useOrderContext()

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

  const calculateAmountWithoutOptions = useCallback(
    (baseRate: number | undefined, term: number | undefined, downpayment: number | undefined) => {
      const carCost = orderData?.application?.loanCar?.autoPrice
      if (!!carCost && !!downpayment && !!term && !!baseRate) {
        const rate = baseRate / 12
        // Расчет ежемесячного платежа без учета доп. услуг
        const monthlyPayment = ((carCost - downpayment) * rate) / (1 - Math.pow(1 + rate, -term))
        // Сумма кредита с переплатой без учета доп. услуг
        return parseFloat((monthlyPayment * term).toFixed(2))
      }
    },
    [orderData?.application?.loanCar?.autoPrice],
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
        dateEnd: creditProduct?.activeDateTo,
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
        amountWithoutOptions: calculateAmountWithoutOptions(
          creditProduct?.baseRate,
          bankOffer?.term,
          bankOffer?.downpayment,
        ),
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
        overpayment: bankOffer.overpayment,
      }
      dispatch(
        updateOrder({ orderData: { ...orderData, application: { ...orderData?.application, loanData } } }),
      )

      scrolContainer?.scroll({ top: 0 })
      nextStep()
    },
    [calculateAmountWithoutOptions, creditProductsList, dispatch, nextStep, orderData, scrolContainer],
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
