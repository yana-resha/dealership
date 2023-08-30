import { useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import { AdditionalOptionsFrontdc, OptionType, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'
import { useParams } from 'react-router-dom'

import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { useGetShareFormMutation } from 'shared/api/requests/loanAppLifeCycleDc'
import { formatMoney, formatTerm } from 'shared/lib/utils'
import { Downloader } from 'shared/ui/Downloader'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'

import { getStatus, PreparedStatus } from '../../../entities/application/application.utils'
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
  additionalOptions: AdditionalOptionsFrontdc[]
  overpayment: number | undefined
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
  overpayment,
}: Props) {
  const classes = useStyles()
  const { applicationId = '' } = useParams()

  const { mutateAsync: getShareFormMutate } = useGetShareFormMutation({ dcAppId: applicationId })

  const { additionalEquipment, dealerServices, bankServices, productSum } = useMemo(
    () =>
      additionalOptions.reduce(
        (acc, cur) => {
          const additionalOptionInfo = {
            name: cur.name || '',
            price: cur.price ? formatMoney(cur.price) : '',
            creditStatus: cur.inCreditFlag ? 'В кредит' : 'Не в кредит',
          }

          switch (cur.bankOptionType) {
            case OptionType.BANK:
              acc.bankServices.push(additionalOptionInfo)
              break
            case OptionType.EQUIPMENT:
              acc.additionalEquipment.push(additionalOptionInfo)
              break
            case OptionType.DEALER:
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

  const handleShareClick = useCallback(async () => {
    const blob = await getShareFormMutate()
    if (blob) {
      return new File([blob], 'Письмо об одобрении', { type: 'application/pdf' })
    }
  }, [getShareFormMutate])

  return (
    <Box className={classes.blockContainer}>
      <SberTypography gridColumn="span 6" sberautoVariant="h5" component="p">
        Информация
      </SberTypography>
      {(status === PreparedStatus.approved || status === PreparedStatus.finallyApproved) && (
        <Downloader onDownloadFile={handleShareClick}>
          <Box className={classes.textButtonContainer}>
            <DownloadIcon />
            <SberTypography sberautoVariant="body3" component="p" className={classes.textButton}>
              Скачать
            </SberTypography>
          </Box>
        </Downloader>
      )}
      {statusCode === StatusCode.NEED_REFORMATION && (
        <Box className={cx(classes.textButtonContainer, classes.warningTextContainer)} gridColumn="1/-1">
          Данные индивидуальных условий кредитования могли устареть. Требуется переформировать печатные формы.
        </Box>
      )}
      {statusCode === StatusCode.CLIENT_REJECTED && (
        <Box className={cx(classes.textButtonContainer, classes.warningTextContainer)} gridColumn="1/-1">
          Клиенту необходимо обратиться в отделение банка для актуализации данных.
        </Box>
      )}
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
      <InfoText label="Сумма кредита">{creditAmount ? formatMoney(creditAmount) : ''}</InfoText>
      <InfoText label="Платеж">{monthlyPayment ? formatMoney(monthlyPayment) : ''}</InfoText>
      <InfoText label="ПВ">{downPayment ? formatMoney(downPayment) : ''}</InfoText>
      <InfoText label="Переплата">{formatMoney(overpayment)}</InfoText>
      <InfoText label="% ставка">{rate || ''}%</InfoText>
      <Box className={classes.infoTextContainer} gridColumn="span 2">
        <InfoText label="Кредитный продукт">{productName}</InfoText>
      </Box>
      <InfoText label="Сумма продуктов">{formatMoney(productSum)}</InfoText>
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
