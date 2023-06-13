import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { Box, Divider } from '@mui/material'

import { AdditionalOptionsType } from 'entities/application/constants'
import { Requisite } from 'entities/application/DossierAreas/ui'
import { AdditionalOptionFrontdc, ApplicationFrontdc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import { useStyles } from './RequisitesArea.styles'

type Props = {
  application: ApplicationFrontdc
  setFinancingEnabled: (value: boolean) => void
  changeRequisites: (value: boolean) => void
}

export function RequisitesArea({ application, setFinancingEnabled, changeRequisites }: Props) {
  const classes = useStyles()

  const { additionalEquipment, dealerServices, bankServices } = useMemo(
    () =>
      (application.loanData?.additionalOptions || []).reduce(
        (acc, cur) => {
          switch (cur.bankOptionType) {
            case AdditionalOptionsType.BankServices:
              acc.bankServices.push(cur)
              break
            case AdditionalOptionsType.Equipments:
              acc.additionalEquipment.push(cur)
              break
            case AdditionalOptionsType.DealerServices:
              acc.dealerServices.push(cur)
              break
          }

          return acc
        },
        {
          additionalEquipment: [] as AdditionalOptionFrontdc[],
          dealerServices: [] as AdditionalOptionFrontdc[],
          bankServices: [] as AdditionalOptionFrontdc[],
          productSum: 0,
        },
      ),
    [application.loanData?.additionalOptions],
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
      case 'credit':
        setCreditConfirmation(checked)
        break
      case `${AdditionalOptionsType.Equipments}`:
        setAdditionalEquipmentConfirmation(checked)
        break
      case `${AdditionalOptionsType.DealerServices}`:
        setDealerServicesConfirmation(checked)
        break
      case `${AdditionalOptionsType.BankServices}`:
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
          <SwitchInput label="Проверено" id="credit" afterChange={handleChange} />
        </Box>
        <Box className={classes.requisiteInfo}>
          <InfoText label="Юридическое лицо">{application.vendor?.vendorName || ''}</InfoText>
          <InfoText label="Сумма кредита">{application?.loanData?.creditAmount || ''} руб.</InfoText>
          <InfoText label="Банк получатель">{application.vendor?.vendorBankDetails?.bank || ''}</InfoText>
          <InfoText label="Номер счета банка">
            {application.vendor?.vendorBankDetails?.accountNumber || ''}
          </InfoText>
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
              id={`${AdditionalOptionsType.Equipments}`}
              afterChange={handleChange}
            />
          </Box>
          {additionalEquipment.map(option => (
            <Box key={option.name} className={classes.requisiteElement}>
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
              id={`${AdditionalOptionsType.DealerServices}`}
              afterChange={handleChange}
            />
          </Box>
          {dealerServices.map(option => (
            <Requisite key={option.name} additionalOption={option} />
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
              id={`${AdditionalOptionsType.BankServices}`}
              afterChange={handleChange}
            />
          </Box>
          {bankServices.map(option => (
            <Requisite key={option.name} additionalOption={option} />
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
