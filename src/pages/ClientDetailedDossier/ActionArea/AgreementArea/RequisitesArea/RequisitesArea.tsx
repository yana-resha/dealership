import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { Box, Button, Divider } from '@mui/material'
import {
  AdditionalOptionsFrontdc,
  ApplicationFrontdc,
  OptionType,
} from '@sberauto/loanapplifecycledc-proto/public'

import { formatMoney } from 'shared/lib/utils'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import { Requisite } from './Requisite/Requisite'
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
          if (!cur.inCreditFlag) {
            return acc
          }
          switch (cur.bankOptionType) {
            case OptionType.BANK:
              acc.bankServices.push(cur)
              break
            case OptionType.EQUIPMENT:
              acc.additionalEquipment.push(cur)
              break
            case OptionType.DEALER:
              acc.dealerServices.push(cur)
              break
          }

          return acc
        },
        {
          additionalEquipment: [] as AdditionalOptionsFrontdc[],
          dealerServices: [] as AdditionalOptionsFrontdc[],
          bankServices: [] as AdditionalOptionsFrontdc[],
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
      case `${OptionType.EQUIPMENT}`:
        setAdditionalEquipmentConfirmation(checked)
        break
      case `${OptionType.DEALER}`:
        setDealerServicesConfirmation(checked)
        break
      case `${OptionType.BANK}`:
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
    setFinancingEnabled,
    additionalEquipment.length,
    dealerServices.length,
    bankServices.length,
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
          <InfoText label="Сумма кредита">{formatMoney(application?.loanData?.amount)}</InfoText>
          <InfoText label="Банк получатель">
            {application.vendor?.broker?.requisites?.accountRequisite?.bank || ''}
          </InfoText>
          <InfoText label="Расчетный счет">
            {application.vendor?.broker?.requisites?.accountRequisite?.accountNumber || ''}
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
            <SwitchInput label="Проверено" id={`${OptionType.EQUIPMENT}`} afterChange={handleChange} />
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
            <SwitchInput label="Проверено" id={`${OptionType.DEALER}`} afterChange={handleChange} />
          </Box>
          {dealerServices.map(option => (
            <Box key={option.name} className={classes.requisiteElement}>
              <Requisite key={option.name} additionalOption={option} />
              <Divider />
            </Box>
          ))}
        </Box>
      )}

      {bankServices.length > 0 && (
        <Box className={classes.requisiteContainer}>
          <Box className={classes.requisitesLine}>
            <SberTypography sberautoVariant="h6" component="p">
              Дополнительные услуги банка
            </SberTypography>
            <SwitchInput label="Проверено" id={`${OptionType.BANK}`} afterChange={handleChange} />
          </Box>
          {bankServices.map(option => (
            <Box key={option.name} className={classes.requisiteElement}>
              <Requisite key={option.name} additionalOption={option} />
              <Divider />
            </Box>
          ))}
        </Box>
      )}
      <Button variant="text" className={classes.textButton} onClick={goToEditRequisitesMode} disabled>
        Изменить реквизиты
      </Button>
    </Box>
  )
}
