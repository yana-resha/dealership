import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { Box, Divider } from '@mui/material'

import { Requisite } from 'entities/application/DossierAreas/ui'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import { AdditionalOptionsTypes } from '../../../application.utils'
import { AdditionalOptions } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { useStyles } from './RequisitesArea.styles'

type Props = {
  creditLegalEntity: string
  creditSum: number
  creditReceiverBank: string
  creditBankAccountNumber: string
  additionalOptions: AdditionalOptions[]
  setFinancingEnabled: (value: boolean) => void
  changeRequisites: (value: boolean) => void
}

export function RequisitesArea(props: Props) {
  const classes = useStyles()
  const {
    creditLegalEntity,
    creditReceiverBank,
    creditBankAccountNumber,
    creditSum,
    additionalOptions,
    setFinancingEnabled,
    changeRequisites,
  } = props
  const additionalEquipment = additionalOptions.filter(
    option => option.optionType === AdditionalOptionsTypes.additionalEquipment,
  )
  const dealerServices = additionalOptions.filter(
    option => option.optionType === AdditionalOptionsTypes.dealerServices,
  )
  const bankServices = additionalOptions.filter(
    option => option.optionType === AdditionalOptionsTypes.bankServices,
  )
  const [creditConfirmation, setCreditConfirmation] = useState(false)
  const [additionalEquipmentConfirmation, setAdditionalEquipmentConfirmation] = useState(false)
  const [dealerServicesConfirmation, setDealerServicesConfirmation] = useState(false)
  const [bankServicesConfirmation, setBankServicesConfirmation] = useState(false)

  const goToEditRequisitesMode = useCallback(() => {
    changeRequisites(true)
  }, [changeRequisites])

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const requisiteType = event.target.id
    const { checked } = event.target
    switch (requisiteType) {
      case AdditionalOptionsTypes.credit:
        setCreditConfirmation(checked)
        break
      case AdditionalOptionsTypes.additionalEquipment:
        setAdditionalEquipmentConfirmation(checked)
        break
      case AdditionalOptionsTypes.dealerServices:
        setDealerServicesConfirmation(checked)
        break
      case AdditionalOptionsTypes.bankServices:
        setBankServicesConfirmation(checked)
        break
    }
  }, [])

  useEffect(() => {
    setFinancingEnabled(
      creditConfirmation &&
        (additionalEquipmentConfirmation || additionalEquipment.length === 0) &&
        (dealerServicesConfirmation || dealerServices.length === 0) &&
        (bankServicesConfirmation || bankServices.length === 0),
    )
  }, [
    creditConfirmation,
    additionalEquipmentConfirmation,
    dealerServicesConfirmation,
    bankServicesConfirmation,
  ])

  return (
    <Box className={classes.requisitesBlock}>
      <Box className={classes.requisiteContainer}>
        <Box className={classes.requisitesLine}>
          <SberTypography sberautoVariant="h6" component="p">
            Кредит
          </SberTypography>
          <SwitchInput label="Проверено" id={AdditionalOptionsTypes.credit} afterChange={handleChange} />
        </Box>
        <Box className={classes.requisiteInfo}>
          <InfoText label="Юридическое лицо">{creditLegalEntity}</InfoText>
          <InfoText label="Сумма кредита">{creditSum} руб.</InfoText>
          <InfoText label="Банк получатель">{creditReceiverBank}</InfoText>
          <InfoText label="Номер счета банка">{creditBankAccountNumber}</InfoText>
        </Box>
        <Divider />
      </Box>

      {additionalEquipment.length > 0 && (
        <Box className={classes.requisiteContainer}>
          <Box className={classes.requisitesLine}>
            <SberTypography sberautoVariant="h6" component="p">
              Дополнительное оборудование
            </SberTypography>
            <SwitchInput
              label="Проверено"
              id={AdditionalOptionsTypes.additionalEquipment}
              afterChange={handleChange}
            />
          </Box>
          {additionalEquipment.map(option => (
            <Box key={option.productType} className={classes.requisiteElement}>
              <Requisite additionalOption={option} />
              <Divider />
            </Box>
          ))}
        </Box>
      )}

      {dealerServices.length > 0 && (
        <Box className={classes.requisiteContainer}>
          <Box className={classes.requisitesLine}>
            <SberTypography sberautoVariant="h6" component="p">
              Дополнительные услуги дилера
            </SberTypography>
            <SwitchInput
              label="Проверено"
              id={AdditionalOptionsTypes.dealerServices}
              afterChange={handleChange}
            />
          </Box>
          {dealerServices.map(option => (
            <Requisite key={option.productType} additionalOption={option} />
          ))}
          <Divider />
        </Box>
      )}

      {bankServices.length > 0 && (
        <Box className={classes.requisiteContainer}>
          <Box className={classes.requisitesLine}>
            <SberTypography sberautoVariant="h6" component="p">
              Дополнительные услуги банка
            </SberTypography>
            <SwitchInput
              label="Проверено"
              id={AdditionalOptionsTypes.bankServices}
              afterChange={handleChange}
            />
          </Box>
          {bankServices.map(option => (
            <Requisite key={option.productType} additionalOption={option} />
          ))}
          <Divider />
        </Box>
      )}
      <SberTypography
        sberautoVariant="body3"
        component="p"
        className={classes.textButton}
        onClick={goToEditRequisitesMode}
      >
        Изменить реквизиты
      </SberTypography>
    </Box>
  )
}
