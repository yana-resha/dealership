import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Typography } from '@mui/material'
import { CalculateCreditRequest, CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { FullOrderCalculator } from 'common/OrderCalculator'
import { BankOffers } from 'entities/BankOffers'
import { useCalculateCreditMutation } from 'shared/api/requests/dictionaryDc.api'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './FullOrderSettings.styles'

type Props = {
  nextStep: () => void
  onChangeForm: () => void
}

export function FullOrderSettings({ nextStep, onChangeForm }: Props) {
  const classes = useStyles()
  const [bankOffers, setBankOffers] = useState<CalculatedProduct[] | null>(null)
  const [isOfferLoading, setIsOfferLoading] = useState(false)

  const { mutateAsync, isError } = useCalculateCreditMutation()

  const clearBankOfferList = useCallback(() => {
    if (!bankOffers?.length) {
      return
    }
    setBankOffers(null)
  }, [bankOffers?.length])

  useEffect(() => {
    if (isError) {
      setIsOfferLoading(false)
      clearBankOfferList()
    }
  }, [clearBankOfferList, isError])

  const handleFormChange = useCallback(() => {
    clearBankOfferList()
    onChangeForm()
  }, [clearBankOfferList, onChangeForm])

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
  }, [bankOffers?.length])

  return (
    <div className={classes.page} data-testid="fullOrderSettingsPage">
      <FullOrderCalculator
        isSubmitLoading={isOfferLoading}
        onSubmit={calculateCredit}
        onChangeForm={handleFormChange}
      />
      {isError && (
        <Box className={classes.errorContainer}>
          <Typography>Произошла ошибка при загрузке данных. Попробуйте снова</Typography>
        </Box>
      )}
      {!isError && bankOffers !== null && bankOffers.length > 0 && (
        <BankOffers data={bankOffers} onRowClick={nextStep} ref={bankOffersRef} />
      )}
      {!isError && bankOffers !== null && bankOffers.length === 0 && (
        <Box m={2}>
          <SberTypography sberautoVariant="body5" component="p">
            Кредитные продукты не найдены
          </SberTypography>
        </Box>
      )}
    </div>
  )
}
