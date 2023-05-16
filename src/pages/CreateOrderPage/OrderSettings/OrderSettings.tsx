import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { CalculateCreditRequest, CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { OrderCalculator } from 'common/OrderCalculator'
import { BankOffers } from 'entities/BankOffers'

import { useCalculateCreditMutation } from './OrderSettings.api'

const useStyles = makeStyles(theme => ({
  errorContainer: {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 3),
    color: theme.palette.error.main,
  },
}))

type Props = {
  nextStep: () => void
}

export function OrderSettings({ nextStep }: Props) {
  const classes = useStyles()
  const [bankOffers, setBankOffers] = useState<CalculatedProduct[]>([])
  const { mutateAsync, isError } = useCalculateCreditMutation()
  const [isOfferLoading, setIsOfferLoading] = useState(false)

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
    [mutateAsync, isError],
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
      <OrderCalculator
        isOfferLoading={isOfferLoading}
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
    </>
  )
}
