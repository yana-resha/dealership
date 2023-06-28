import { Box } from '@mui/material'
import { BankOptionType } from '@sberauto/loanapplifecycledc-proto/public'

import { AdditionalOptionFrontdc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { formatMoney } from 'shared/lib/utils'
import { InfoText } from 'shared/ui/InfoText/InfoText'

import { useStyles } from './Requisite.styles'

type Props = {
  additionalOption: AdditionalOptionFrontdc
}

export function Requisite({ additionalOption }: Props) {
  const classes = useStyles()
  const { bankOptionType, name, vendor, broker, price, term, docNumber, brokerAccount, vendorAccount } =
    additionalOption

  const label = bankOptionType === BankOptionType.EQUIPMENTS ? 'Тип доп. оборудования' : 'Тип продукта'
  const beneficiaryBank = broker ? brokerAccount?.bank : vendorAccount?.bank
  const correspondentAccount = broker ? brokerAccount?.accountCorrNumber : vendorAccount?.accountCorrNumber
  const bankAccountNumber = broker ? brokerAccount?.accountNumber : vendorAccount?.accountNumber
  const tax = broker ? brokerAccount?.tax : vendorAccount?.tax

  return (
    <Box className={classes.requisiteContainer}>
      <Box className={classes.requisiteInfo}>
        <InfoText label={label}>{name || ''}</InfoText>
        {vendor && <InfoText label="Страховая компания">{vendor}</InfoText>}
        {broker && <InfoText label="Агент получатель">{broker}</InfoText>}
        {price !== undefined && <InfoText label="Стоимость">{formatMoney(price)}</InfoText>}
        {term && <InfoText label="Срок">{term} мес.</InfoText>}
        {docNumber && <InfoText label="Номер полиса">{docNumber}</InfoText>}
        {beneficiaryBank && <InfoText label="Получатель">{beneficiaryBank}</InfoText>}
        {correspondentAccount && <InfoText label="Номер счета банка">{correspondentAccount}</InfoText>}
        {bankAccountNumber && <InfoText label="Расчетный счет">{bankAccountNumber}</InfoText>}
        <InfoText label="Налог">{tax || 'Без НДС'}</InfoText>
      </Box>
    </Box>
  )
}
