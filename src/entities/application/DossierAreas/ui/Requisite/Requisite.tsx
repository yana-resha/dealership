import React from 'react'

import { Box } from '@mui/material'

import { InfoText } from 'shared/ui/InfoText/InfoText'

import { AdditionalOptionsTypes } from '../../../application.utils'
import { AdditionalOptions } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { useStyles } from './Requisite.styles'

type Props = {
  additionalOption: AdditionalOptions
}

export function Requisite(option: Props) {
  const classes = useStyles()
  const {
    optionType,
    loanTerm,
    productType,
    provider,
    taxPresence,
    productCost,
    bankAccountNumber,
    documentId,
    correspondentAccount,
    agent,
    beneficiaryBank,
  } = option.additionalOption

  return (
    <Box className={classes.requisiteContainer}>
      <Box className={classes.requisiteInfo}>
        <InfoText
          label={
            optionType === AdditionalOptionsTypes.additionalEquipment
              ? 'Тип доп. оборудования'
              : 'Тип продукта'
          }
        >
          {productType}
        </InfoText>
        {provider && <InfoText label="Страховая компания">{provider}</InfoText>}
        {agent && <InfoText label="Агент получатель">{agent}</InfoText>}
        {productCost > 0 && <InfoText label="Стоимость">{productCost} руб.</InfoText>}
        {loanTerm > 0 && <InfoText label="Срок">{loanTerm} мес.</InfoText>}
        {documentId && <InfoText label="Номер полиса">{documentId}</InfoText>}
        {beneficiaryBank && <InfoText label="Получатель">{beneficiaryBank}</InfoText>}
        {correspondentAccount && <InfoText label="Номер счета банка">{correspondentAccount}</InfoText>}
        {bankAccountNumber && <InfoText label="Расчетный счет">{bankAccountNumber}</InfoText>}
        <InfoText label="Налог">{taxPresence ? 'C НДС' : 'Без НДС'}</InfoText>
      </Box>
    </Box>
  )
}
