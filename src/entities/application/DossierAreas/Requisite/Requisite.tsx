import React from 'react'

import { Box } from '@mui/material'

import { InfoText } from 'shared/ui/InfoText/InfoText'

import { AdditionalOptionsTypes } from '../../application.utils'
import { AdditionalOptions } from '../__tests__/mocks/clientDetailedDossier.mock'
import { useStyles } from './Requisite.styles'

type Props = {
  additionalOption: AdditionalOptions
}

export function Requisite(option: Props) {
  const classes = useStyles()
  const {
    optionType,
    term,
    typeOfProduct,
    insuranceCompany,
    tax,
    price,
    accountNumber,
    policyNumber,
    bankNumber,
    agentReceiver,
    receiver,
    provider,
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
          {typeOfProduct}
        </InfoText>
        {insuranceCompany && <InfoText label="Страховая компания">{insuranceCompany}</InfoText>}
        {agentReceiver && <InfoText label="Агент получатель">{agentReceiver}</InfoText>}
        {price > 0 && <InfoText label="Стоимость">{price} руб.</InfoText>}
        {term > 0 && <InfoText label="Срок">{term} мес.</InfoText>}
        {policyNumber && <InfoText label="Номер полиса">{policyNumber}</InfoText>}
        {receiver && <InfoText label="Получатель">{receiver}</InfoText>}
        {bankNumber && <InfoText label="Номер счета банка">{bankNumber}</InfoText>}
        {accountNumber && <InfoText label="Расчетный счет">{accountNumber}</InfoText>}
        {tax && <InfoText label="Налог">{tax}</InfoText>}
      </Box>
    </Box>
  )
}
