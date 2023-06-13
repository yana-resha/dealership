import { useMemo } from 'react'

import Box from '@mui/material/Box'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { ReactComponent as ShareIcon } from 'assets/icons/share.svg'
import { AdditionalOptionsType } from 'entities/application/constants'
import { AdditionalOptionFrontdc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { formatNumber, formatTerm } from 'shared/lib/utils'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'

import { getStatus, PreparedStatus } from '../../../application.utils'
import { AdditionalOptionInfo, AdditionalOptionList } from './AdditionalOptionInfo/AdditionalOptionList'
import { useStyles } from './InformationArea.styles'

type Props = {
  statusCode: StatusCode
  vendorCode: string | undefined
  vendorInfo: string
  carBrand: string
  carModel: string
  creditAmount: number | undefined
  monthlyPayment: number | undefined
  downPayment: number | undefined
  rate: number | undefined
  productName: string
  term: number | undefined
  additionalOptions: AdditionalOptionFrontdc[]
}

export function InformationArea({
  statusCode,
  vendorCode,
  vendorInfo,
  carBrand,
  carModel,
  creditAmount,
  monthlyPayment,
  downPayment,
  rate,
  productName,
  term,
  additionalOptions,
}: Props) {
  const classes = useStyles()
  const { additionalEquipment, dealerServices, bankServices, productSum } = useMemo(
    () =>
      additionalOptions.reduce(
        (acc, cur) => {
          const additionalOptionInfo = {
            name: cur.name || '',
            price: `${cur.price || ''}  руб.`,
            creditStatus: cur.inCreditFlag ? 'В кредит' : 'Не в кредит',
          }

          switch (cur.bankOptionType) {
            case AdditionalOptionsType.BankServices:
              acc.bankServices.push(additionalOptionInfo)
              break
            case AdditionalOptionsType.Equipments:
              acc.additionalEquipment.push(additionalOptionInfo)
              break
            case AdditionalOptionsType.DealerServices:
              acc.dealerServices.push(additionalOptionInfo)
              break
          }

          if (cur.price) {
            acc.productSum = acc.productSum + cur.price
          }

          return acc
        },
        {
          additionalEquipment: [] as AdditionalOptionInfo[],
          dealerServices: [] as AdditionalOptionInfo[],
          bankServices: [] as AdditionalOptionInfo[],
          productSum: 0,
        },
      ),
    [additionalOptions],
  )

  const status = getStatus(statusCode)
  const showGraphicButton = [
    PreparedStatus.initial,
    PreparedStatus.processed,
    PreparedStatus.approved,
    PreparedStatus.finallyApproved,
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
          {vendorCode && <SberTypography component="span">{vendorCode}&nbsp;</SberTypography>}
          {vendorInfo}
        </InfoText>
      </Box>
      <Box className={classes.infoTextContainer} gridColumn="span 2">
        <InfoText label="Марка / модель">
          {carBrand} {carModel}
        </InfoText>
      </Box>
      <InfoText label="Сумма кредита">{creditAmount ? formatNumber(creditAmount) : ''}</InfoText>
      <InfoText label="Платеж">{monthlyPayment ? formatNumber(monthlyPayment) : ''}</InfoText>
      <InfoText label="ПВ">{downPayment ? formatNumber(downPayment) : ''}</InfoText>
      {/* TODO DCB-421 | Прокинуть значение, когда Аналитики дадут ответ, как его вычеслять или где взять */}
      <InfoText label="Переплата">{/* formatNumber(overdraft) */}</InfoText>
      <InfoText label="% ставка">{rate || ''}%</InfoText>
      <Box className={classes.infoTextContainer} gridColumn="span 2">
        <InfoText label="Кредитный продукт">{productName}</InfoText>
      </Box>
      <InfoText label="Сумма продуктов">{formatNumber(productSum)}</InfoText>
      <InfoText label="Срок кредита">{term ? formatTerm(term) : ''}</InfoText>
      {showGraphicButton && (
        <Box className={classes.textButtonContainer} gridColumn="span 2">
          <ScheduleIcon />
          <SberTypography sberautoVariant="body3" component="p" className={classes.textButton}>
            График платежей
          </SberTypography>
        </Box>
      )}

      <AdditionalOptionList title="Дополнительное оборудование" options={additionalEquipment} />
      <AdditionalOptionList title="Дополнительные услуги дилера" options={dealerServices} />
      <AdditionalOptionList title="Дополнительные услуги банка" options={bankServices} />
    </Box>
  )
}
