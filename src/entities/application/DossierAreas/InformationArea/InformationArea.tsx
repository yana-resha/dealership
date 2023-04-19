import React from 'react'

import { Box } from '@mui/material'

import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { ReactComponent as ShareIcon } from 'assets/icons/share.svg'
import { formatNumber, formatTerm } from 'shared/lib/utils'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'

import { getStatus, PreparedStatus } from '../../application.utils'
import { useStyles } from './InformationArea.styles'

type Props = {
  clientDossier: any
}

export function InformationArea(props: Props) {
  const classes = useStyles()
  const { clientDossier } = props
  const {
    dealerCenterNumber,
    dealerCenterName,
    dealerCenterAddress,
    carBrand,
    carModel,
    creditSum,
    monthlyPayment,
    downPayment,
    overdraft,
    rate,
    productSum,
    term,
    productName,
  } = clientDossier
  const status = getStatus(clientDossier.status)
  const showGraphicButton = [
    PreparedStatus.initial,
    PreparedStatus.processed,
    PreparedStatus.approved,
    PreparedStatus.finallyApproved,
    PreparedStatus.formation,
    PreparedStatus.signed,
  ].includes(status)

  return (
    <Box className={classes.blockContainer}>
      <SberTypography gridColumn="span 6" sberautoVariant="h5" component="p">
        Информация
      </SberTypography>
      <Box className={classes.textButtonContainer}>
        <ShareIcon />
        <SberTypography sberautoVariant="body3" component="p" className={classes.textButton}>
          Поделиться
        </SberTypography>
      </Box>
      <Box className={classes.infoTextContainer} gridColumn="span 7">
        <InfoText label="ДЦ">
          <SberTypography component="span">{dealerCenterNumber}&nbsp;</SberTypography>
          {dealerCenterName}, {dealerCenterAddress}
        </InfoText>
      </Box>
      <Box className={classes.infoTextContainer} gridColumn="span 2">
        <InfoText label="Марка / модель">
          {carBrand} {carModel}
        </InfoText>
      </Box>
      <InfoText label="Сумма кредита">{formatNumber(creditSum)}</InfoText>
      <InfoText label="Платеж">{formatNumber(monthlyPayment)}</InfoText>
      <InfoText label="ПВ">{formatNumber(downPayment)}</InfoText>
      <InfoText label="Переплата">{formatNumber(overdraft)}</InfoText>
      <InfoText label="% ставка">{rate}%</InfoText>
      <Box className={classes.infoTextContainer} gridColumn="span 2">
        <InfoText label="Кредитный продукт">{productName}</InfoText>
      </Box>
      <InfoText label="Сумма продуктов">{formatNumber(productSum)}</InfoText>
      <InfoText label="Срок кредита">{formatTerm(term)}</InfoText>
      {showGraphicButton && (
        <Box className={classes.textButtonContainer} gridColumn="span 2">
          <ScheduleIcon />
          <SberTypography sberautoVariant="body3" component="p" className={classes.textButton}>
            График платежей
          </SberTypography>
        </Box>
      )}
    </Box>
  )
}
