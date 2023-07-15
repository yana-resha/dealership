import { Box, Typography } from '@mui/material'

import { FullOrderCalculator } from 'common/OrderCalculator'
import { useOrderSettings } from 'common/OrderCalculator/hooks/useOrderSettings'
import { BankOffers } from 'entities/BankOffers'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './FullOrderSettings.styles'

type Props = {
  nextStep: () => void
  onChangeForm: () => void
}

export function FullOrderSettings({ nextStep, onChangeForm }: Props) {
  const classes = useStyles()

  const {
    isOfferError,
    isOfferLoading,
    bankOffers,
    bankOffersRef,
    calculateCredit,
    handleFormChange,
    handleCreditProductClick,
  } = useOrderSettings(nextStep, onChangeForm)

  return (
    <div className={classes.page} data-testid="fullOrderSettingsPage">
      <FullOrderCalculator
        isSubmitLoading={isOfferLoading}
        onSubmit={calculateCredit}
        onChangeForm={handleFormChange}
      />
      {isOfferError && (
        <Box className={classes.errorContainer}>
          <Typography>Произошла ошибка при загрузке данных. Попробуйте снова</Typography>
        </Box>
      )}
      {!isOfferError && bankOffers !== null && bankOffers.length > 0 && (
        <BankOffers data={bankOffers} onRowClick={handleCreditProductClick} ref={bankOffersRef} />
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
