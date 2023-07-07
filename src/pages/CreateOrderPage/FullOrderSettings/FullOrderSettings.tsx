import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Typography } from '@mui/material'
import { CalculateCreditRequest, CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { FullOrderCalculator } from 'common/OrderCalculator'
import { BankOffers } from 'entities/BankOffers'
import { useCalculateCreditMutation } from 'shared/api/requests/dictionaryDc.api'

import { dataMock } from './__tests__/FullOrderSettings.test.mock'
import { useStyles } from './FullOrderSettings.styles'

type Props = {
  nextStep: () => void
}

export function FullOrderSettings({ nextStep }: Props) {
  const classes = useStyles()
  const [bankOffers, setBankOffers] = useState<CalculatedProduct[]>([])
  const [isOfferLoading, setIsOfferLoading] = useState(false)

  const { mutateAsync, isError } = useCalculateCreditMutation()
  useEffect(() => {
    if (isError) {
      setIsOfferLoading(false)
      setBankOffers([])
    }
  }, [isError])

  const clearBankOfferList = useCallback(() => {
    if (!bankOffers.length) {
      return
    }
    setBankOffers([])
  }, [bankOffers.length])

  const calculateCredit = useCallback(
    async (data: CalculateCreditRequest) => {
      setIsOfferLoading(true)
      const res = await mutateAsync(data)
      if (res && res.products) {
        setBankOffers(res.products)
        setIsOfferLoading(false)
      }
    },
    [mutateAsync],
  )

  const bankOffersRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (bankOffersRef.current) {
      bankOffersRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [bankOffers.length])

  return (
    <div className={classes.page} data-testid="fullOrderSettingsPage">
      <FullOrderCalculator
        isSubmitLoading={isOfferLoading}
        onSubmit={calculateCredit}
        onChangeForm={clearBankOfferList}
      />
      {isError && (
        <Box className={classes.errorContainer}>
          <Typography>Произошла ошибка при загрузке данных. Попробуйте снова</Typography>
        </Box>
      )}
      {!isError && bankOffers.length > 0 && (
        <BankOffers data={bankOffers} onRowClick={nextStep} ref={bankOffersRef} />
      )}
    </div>
  )
}
