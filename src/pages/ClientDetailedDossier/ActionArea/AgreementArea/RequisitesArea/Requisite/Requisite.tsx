import { Box } from '@mui/material'
import { AdditionalOptionsFrontdc, OptionType } from '@sberauto/loanapplifecycledc-proto/public'

import { formatMoney } from 'shared/lib/utils'
import { InfoText } from 'shared/ui/InfoText/InfoText'

import { useStyles } from './Requisite.styles'

type Props = {
  additionalOption: AdditionalOptionsFrontdc
}

export function Requisite({ additionalOption }: Props) {
  const classes = useStyles()
  const { bankOptionType, name, vendor, broker, price, term, docNumber } = additionalOption

  const label = bankOptionType === OptionType.EQUIPMENT ? 'Тип доп. оборудования' : 'Тип продукта'
  const beneficiaryBank = broker
    ? broker.requisites?.accountRequisite?.bank
    : vendor?.requisites?.accountRequisite?.bank
  const correspondentAccount = broker
    ? broker.requisites?.accountRequisite?.accountCorrNumber
    : vendor?.requisites?.accountRequisite?.accountCorrNumber
  const bankAccountNumber = broker
    ? broker.requisites?.accountRequisite?.accountNumber
    : vendor?.requisites?.accountRequisite?.accountNumber
  const tax = broker ? broker.taxInfo?.amount : vendor?.taxInfo?.amount

  return (
    <Box className={classes.requisiteContainer}>
      <Box className={classes.requisiteInfo}>
        <InfoText label={label}>{name || ''}</InfoText>
        {vendor && <InfoText label="Страховая компания">{vendor?.vendorName}</InfoText>}
        {broker && <InfoText label="Агент получатель">{broker?.vendorName}</InfoText>}
        {price !== undefined && <InfoText label="Стоимость">{formatMoney(price)}</InfoText>}
        {term && <InfoText label="Срок">{term} мес.</InfoText>}
        {docNumber && <InfoText label="Номер полиса">{docNumber}</InfoText>}
        {beneficiaryBank && <InfoText label="Получатель">{beneficiaryBank}</InfoText>}
        {correspondentAccount && <InfoText label="Корреспондентский счёт">{correspondentAccount}</InfoText>}
        {bankAccountNumber && <InfoText label="Расчетный счет">{bankAccountNumber}</InfoText>}
        <InfoText label="НДС">{tax || 'Без НДС'}</InfoText>
      </Box>
    </Box>
  )
}