import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { CalculateCreditRequest, CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { OrderCalculator } from 'common/OrderCalculator'
import { BankOffers } from 'entities/BankOffers'
import { useCalculateCreditMutation } from 'shared/api/requests/dictionaryDc.api'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { updateOrder } from '../model/orderSlice'

const useStyles = makeStyles(theme => ({
  errorContainer: {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 3),
    color: theme.palette.error.main,
  },
}))

type Props = {
  nextStep: () => void
  applicationId?: string
}

export function OrderSettings({ nextStep, applicationId }: Props) {
  const classes = useStyles()
  const [bankOffers, setBankOffers] = useState<CalculatedProduct[]>([])
  const [isOfferLoading, setIsOfferLoading] = useState(false)
  const dispatch = useAppDispatch()

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
      dispatch(updateOrder({ orderData: data }))
      setIsOfferLoading(true)
      const res = await mutateAsync(data)
      if (res && res.products) {
        setBankOffers(res.products)
        setIsOfferLoading(false)
      }
    },
    [mutateAsync, dispatch],
  )

  const bankOffersRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (bankOffersRef.current) {
      bankOffersRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [bankOffers.length])

  return (
    <>
      <OrderCalculator
        isSubmitLoading={isOfferLoading}
        onSubmit={calculateCredit}
        onChangeForm={clearBankOfferList}
        applicationId={applicationId}
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
