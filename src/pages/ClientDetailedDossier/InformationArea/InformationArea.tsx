import { useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import { AdditionalOptionsFrontdc, OptionType, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { useParams } from 'react-router-dom'

import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import {
  useGetPreliminaryPaymentScheduleFormMutation,
  useGetShareFormMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { formatMoney, formatNumber, formatTerm } from 'shared/lib/utils'
import { Downloader } from 'shared/ui/Downloader'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'

import { getStatus, PreparedStatus } from '../../../entities/application/application.utils'
import { DossierAreaContainer } from '../DossierAreaContainer/DossierAreaContainer'
import { AdditionalOptionInfo, AdditionalOptionList } from './AdditionalOptionInfo/AdditionalOptionList'
import { ApplicationWarning } from './ApplicationWarning/ApplicationWarning'
import { useStyles } from './InformationArea.styles'

type Props = {
  statusCode: StatusCode
  vendorCode: string | undefined
  vendorInfo: string
  carBrand: string
  carModel: string
  autoPrice: number | undefined
  creditAmount: number | undefined
  monthlyPayment: number | undefined
  downPayment: number | undefined
  rate: number | undefined
  productName: string
  term: number | undefined
  additionalOptions: AdditionalOptionsFrontdc[]
  overpayment: number | undefined
  incomeProduct: boolean
}

export function InformationArea({
  statusCode,
  vendorCode,
  vendorInfo,
  autoPrice,
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
  incomeProduct,
}: Props) {
  const classes = useStyles()
  const { applicationId = '' } = useParams()

  const { mutateAsync: getShareFormMutate } = useGetShareFormMutation({ dcAppId: applicationId })
  const { mutateAsync: getPreliminaryPaymentScheduleFormMutate } =
    useGetPreliminaryPaymentScheduleFormMutation()

  const {
    additionalEquipment,
    dealerServices,
    bankServices,
    servicesInCreditPrice,
    equipmentInCreditPrice,
    productSum,
  } = useMemo(
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
              if (cur.price && cur.inCreditFlag) {
                acc.servicesInCreditPrice = acc.servicesInCreditPrice + cur.price
              }
              break
            case OptionType.DEALER:
              acc.dealerServices.push(additionalOptionInfo)
              if (cur.price && cur.inCreditFlag) {
                acc.equipmentInCreditPrice = acc.equipmentInCreditPrice + cur.price
              }
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
          servicesInCreditPrice: 0,
          equipmentInCreditPrice: 0,
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

  const handlePaymentScheduleClick = useCallback(async () => {
    const blob = await getPreliminaryPaymentScheduleFormMutate({
      productName: productName,
      incomeFlag: incomeProduct,
      autoPrice: autoPrice,
      rate,
      downpayment: downPayment,
      monthlyPayment,
      term,
      overpayment,
      servicesInCreditPrice,
      equipmentInCreditPrice,
    })

    if (blob) {
      return new File([blob], 'График платежей', { type: 'application/pdf' })
    }
  }, [
    autoPrice,
    downPayment,
    equipmentInCreditPrice,
    getPreliminaryPaymentScheduleFormMutate,
    incomeProduct,
    monthlyPayment,
    overpayment,
    productName,
    rate,
    servicesInCreditPrice,
    term,
  ])

  return (
    <>
      <DossierAreaContainer>
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
          <ApplicationWarning statusCode={statusCode} />

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
          {/* переводим baseRate (0...1) в проценты */}
          <InfoText label="% ставка">{rate ? parseFloat((rate * 100).toFixed(2)) : ''}%</InfoText>
          <Box className={classes.infoTextContainer} gridColumn="span 2">
            <InfoText label="Кредитный продукт">{productName}</InfoText>
          </Box>
          <InfoText label="Сумма продуктов">{formatMoney(productSum)}</InfoText>
          <InfoText label="Срок кредита">{term ? formatTerm(term) : ''}</InfoText>

          {showGraphicButton && (
            <Downloader onDownloadFile={handlePaymentScheduleClick} gridColumn="span 2">
              <Box className={classes.textButtonContainer}>
                <ScheduleIcon />
                <SberTypography sberautoVariant="body3" component="p" className={classes.textButton}>
                  График платежей
                </SberTypography>
              </Box>
            </Downloader>
          )}
        </Box>
      </DossierAreaContainer>

      <AdditionalOptionList title="Дополнительное оборудование" options={additionalEquipment} />
      <AdditionalOptionList title="Дополнительные услуги дилера" options={dealerServices} />
      <AdditionalOptionList title="Дополнительные услуги банка" options={bankServices} />
    </>
  )
}
