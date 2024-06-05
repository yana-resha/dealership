import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'

import { useOrderSettings } from 'common/OrderCalculator/hooks/useOrderSettings'
import { BankOffers } from 'entities/BankOffers'
import { CreateOrderPageState } from 'pages/CreateOrder/CreateOrder'
import SberTypography from 'shared/ui/SberTypography'

import { BriefOrderCalculator } from './BriefOrderCalculator/BriefOrderCalculator'
import { FullOrderCalculator } from './FullOrderCalculator/FullOrderCalculator'
import { useStyles } from './OrderCalculator.styles'

type Props = {
  nextStep: () => void
}

export function OrderCalculator({ nextStep }: Props) {
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
    creditProductId,
    resetCreditProductId,
  } = useOrderSettings(nextStep)

  return (
    <div className={classes.container} data-testid="fullOrderSettingsPage">
      {isFullCalculator ? (
        <FullOrderCalculator
          isSubmitLoading={isOfferLoading}
          onSubmit={calculateCredit}
          onChangeForm={handleFormChange}
          creditProductId={creditProductId}
          resetCreditProductId={resetCreditProductId}
        />
      ) : (
        <BriefOrderCalculator
          isSubmitLoading={isOfferLoading}
          onSubmit={calculateCredit}
          onChangeForm={handleFormChange}
          creditProductId={creditProductId}
          resetCreditProductId={resetCreditProductId}
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
