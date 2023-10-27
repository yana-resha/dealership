import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'

import { BankOffers } from 'entities/BankOffers'
import { useOrderSettings } from 'pages/CreateOrderPage/Calculator/useOrderSettings'
import { CreateOrderPageState } from 'pages/CreateOrderPage/CreateOrderPage'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './Calculator.styles'
import { FullOrderCalculator } from './FullOrderCalculator/FullOrderCalculator'
import { OrderCalculator } from './OrderCalculator/OrderCalculator'

type Props = {
  nextStep: () => void
}

export function Calculator({ nextStep }: Props) {
  const classes = useStyles()
  const location = useLocation()

  const state = location.state as CreateOrderPageState
  const isFullCalculator = state?.isFullCalculator ?? false
  const {
    isOfferError,
    isOfferLoading,
    bankOffers,
    bankOffersRef,
    calculateCredit,
    handleFormChange,
    handleCreditProductClick,
  } = useOrderSettings(nextStep)

  return (
    <div className={classes.page} data-testid="fullOrderSettingsPage">
      {isFullCalculator ? (
        <FullOrderCalculator
          isSubmitLoading={isOfferLoading}
          onSubmit={calculateCredit}
          onChangeForm={handleFormChange}
        />
      ) : (
        <OrderCalculator
          isSubmitLoading={isOfferLoading}
          onSubmit={calculateCredit}
          onChangeForm={handleFormChange}
        />
      )}
      {isOfferError && (
        <Box className={classes.errorContainer}>
          <SberTypography sberautoVariant="body5" component="p">
            Произошла ошибка при загрузке данных. Попробуйте снова
          </SberTypography>
        </Box>
      )}
      {!isOfferError && bankOffers !== null && bankOffers.length > 0 && (
        <BankOffers ref={bankOffersRef} data={bankOffers} onRowClick={handleCreditProductClick} />
      )}
      {!isOfferError && bankOffers !== null && bankOffers.length === 0 && (
        <Box m={2}>
          <SberTypography sberautoVariant="body5" component="p">
            Кредитные продукты не найдены
          </SberTypography>
        </Box>
      )}
    </div>
  )
}
