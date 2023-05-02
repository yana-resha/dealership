import { useCallback, useEffect, useRef, useState } from 'react'

import { BankOffers, PreparedTableData } from 'entities/BankOffers'
import { OrderCalculator } from 'entities/OrderCalculator'

import { useCalculateCreditMutation } from './OrderSettings.api'

type Props = {
  nextStep: () => void
}

export function OrderSettings({ nextStep }: Props) {
  const [bankOffers, setBankOffers] = useState<PreparedTableData[]>([])
  const calculateCreditMutation = useCalculateCreditMutation()

  const clearBankOfferList = useCallback(() => {
    if (!bankOffers.length) {
      return
    }
    setBankOffers([])
  }, [bankOffers.length])

  const calculateCredit = useCallback(
    async (data: any) => {
      // TODO DCB-200: Переделать на работу с реальными данными
      const res = await calculateCreditMutation.mutateAsync(data)
      if (res) {
        setBankOffers(res)
      }
    },
    [calculateCreditMutation],
  )

  const bankOffersRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!bankOffersRef.current) {
      return
    }
    bankOffersRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [bankOffers.length])

  return (
    <>
      <OrderCalculator onSubmit={calculateCredit} onChangeForm={clearBankOfferList} />
      {bankOffers.length > 0 && <BankOffers data={bankOffers} onRowClick={nextStep} ref={bankOffersRef} />}
    </>
  )
}
