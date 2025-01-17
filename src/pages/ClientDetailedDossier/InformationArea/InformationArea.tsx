import { useCallback, useMemo } from 'react'

import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { ApplicationStatusCode } from '@sberauto/emailappdc-proto/public'
import {
  AdditionalOptionsFrontdc,
  DocumentType,
  OptionType,
  Scan,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'
import { useParams } from 'react-router-dom'

import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg'
import { ReactComponent as MailIcon } from 'assets/icons/mail.svg'
import { ApplicationSource, getStatus, PreparedStatus } from 'entities/applications/application.utils'
import { useSendEmailDecisionMutation } from 'shared/api/requests/emailAppDc.api'
import {
  useDownloadDocumentMutation,
  useGetPreliminaryPaymentScheduleFormMutation,
  useGetShareFormMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { checkIsNumber } from 'shared/lib/helpers'
import { formatMoney, formatTerm } from 'shared/lib/utils'
import { AreaContainer } from 'shared/ui/AreaContainer'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { Downloader } from 'shared/ui/Downloader'
import { InfoText } from 'shared/ui/InfoText/InfoText'
import SberTypography from 'shared/ui/SberTypography'
import { transformFileName } from 'shared/utils/fileLoading'

import { AdditionalOptionInfo, AdditionalOptionList } from './AdditionalOptionInfo/AdditionalOptionList'
import { ApplicationWarning } from './ApplicationWarning/ApplicationWarning'
import { FeeScheduleBtn } from './FeeScheduleBtn/FeeScheduleBtn'
import { useStyles } from './InformationArea.styles'

const ApplicationStatusCodesMap: Partial<Record<StatusCode, ApplicationStatusCode>> = {
  [StatusCode.APPROVED]: ApplicationStatusCode.APPROVED,
  [StatusCode.FINALLY_APPROVED]: ApplicationStatusCode.FINALLY_APPROVED,
  [StatusCode.REJECTED]: ApplicationStatusCode.REJECTED,
}

type Props = {
  appType: string | undefined
  statusCode: StatusCode
  errorDescription: string | undefined
  vendorCode: string | undefined
  vendorInfo: string
  carBrand: string
  carModel: string
  autoPrice: number | undefined
  isCarNew: boolean | undefined
  creditAmount: number | undefined
  monthlyPayment: number | undefined
  downPayment: number | undefined
  rate: number | undefined
  productName: string
  term: number | undefined
  additionalOptions: AdditionalOptionsFrontdc[]
  overpayment: number | undefined
  incomeProduct: boolean
  scans: Scan[]
  emailId: number | undefined
  isGovProgramDocumentsNecessaryRequest: boolean
  isGovProgramDocumentsPending: boolean
  pskPrc: number | undefined
}

export function InformationArea({
  statusCode,
  errorDescription,
  vendorCode,
  vendorInfo,
  autoPrice,
  isCarNew,
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
  scans,
  emailId,
  isGovProgramDocumentsNecessaryRequest,
  isGovProgramDocumentsPending,
  pskPrc,
  appType,
}: Props) {
  const classes = useStyles()
  const { applicationId = '' } = useParams()

  const { mutateAsync: getShareFormMutate } = useGetShareFormMutation({
    dcAppId: applicationId,
  })
  const { mutateAsync: downloadDocumentMutate } = useDownloadDocumentMutation()
  const { mutate: sendEmailDecisionMutate, isLoading: isSendEmailDecisionLoading } =
    useSendEmailDecisionMutation()
  const { mutateAsync: getPreliminaryPaymentScheduleFormMutate } =
    useGetPreliminaryPaymentScheduleFormMutation()

  const {
    additionalEquipment,
    dealerServices,
    bankServices,
    servicesInCreditPrice,
    equipmentInCreditPrice,
    bankOptionsInCreditPrice,
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
              if (cur.price && cur.inCreditFlag) {
                acc.bankOptionsInCreditPrice = acc.bankOptionsInCreditPrice + cur.price
              }
              break
            case OptionType.EQUIPMENT:
              acc.additionalEquipment.push(additionalOptionInfo)
              if (cur.price && cur.inCreditFlag) {
                acc.equipmentInCreditPrice = acc.equipmentInCreditPrice + cur.price
              }
              break
            case OptionType.DEALER:
              acc.dealerServices.push(additionalOptionInfo)
              if (cur.price && cur.inCreditFlag) {
                acc.servicesInCreditPrice = acc.servicesInCreditPrice + cur.price
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
          bankOptionsInCreditPrice: 0,
          productSum: 0,
        },
      ),
    [additionalOptions],
  )

  const status = getStatus(statusCode)
  // на более ранних статусах график может быть в сканах, но при этом быть старой предыдущей версии заявки
  const isHasFeeScheduleInScans =
    scans.some(scan => scan.type === DocumentType.ESTIMATED_FEE_SCHEDULE) &&
    [
      PreparedStatus.formation,
      PreparedStatus.signed,
      PreparedStatus.signing,
      PreparedStatus.financed,
      PreparedStatus.dcFinanced,
    ].includes(status)

  const isShowScheduleBtn =
    ([
      PreparedStatus.initial,
      PreparedStatus.processed,
      PreparedStatus.additionalCheck,
      PreparedStatus.finallyApproved,
      PreparedStatus.formation,
      PreparedStatus.signed,
      PreparedStatus.signing,
      PreparedStatus.financed,
      PreparedStatus.dcFinanced,
    ].includes(status) ||
      // иначе это заявка из уко на пост залог, по ней нет возможности сформировать график
      // https://wiki.x.sberauto.com/pages/viewpage.action?pageId=1050969954
      (status === PreparedStatus.approved && !!scans.length)) &&
    appType === ApplicationSource.CAR_LOAN_APPLICATION_DC

  const isDisableScheduleBtn =
    [
      PreparedStatus.formation,
      PreparedStatus.signed,
      PreparedStatus.signing,
      PreparedStatus.financed,
      PreparedStatus.dcFinanced,
    ].includes(status) && !isHasFeeScheduleInScans

  const handleSendEmailBtnClick = useCallback(() => {
    sendEmailDecisionMutate({
      emailId,
      dcAppId: applicationId,
      status: ApplicationStatusCodesMap[statusCode],
    })
  }, [applicationId, emailId, sendEmailDecisionMutate, statusCode])

  const handleShareClick = useCallback(async () => {
    const blob = await getShareFormMutate()
    if (blob) {
      return new File(
        [blob],
        transformFileName(DocumentType.SHARING_FORM, applicationId) || 'Письмо об одобрении',
        { type: blob.type },
      )
    }
  }, [applicationId, getShareFormMutate])

  const handleSavedPreliminaryFeeScheduleClick = useCallback(async () => {
    const blob = await downloadDocumentMutate({
      dcAppId: applicationId,
      documentType: DocumentType.ESTIMATED_FEE_SCHEDULE,
    })
    if (blob) {
      return new File(
        [blob],
        transformFileName(DocumentType.ESTIMATED_FEE_SCHEDULE, applicationId) || 'График платежей',
        { type: blob.type },
      )
    }
  }, [applicationId, downloadDocumentMutate])

  const handlePreliminaryFeeScheduleClick = useCallback(async () => {
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
      bankOptionsInCreditPrice,
      pskPrc,
    })
    if (blob) {
      return new File(
        [blob],
        transformFileName(DocumentType.ESTIMATED_FEE_SCHEDULE, applicationId) || 'График платежей',
        { type: blob.type },
      )
    }
  }, [
    applicationId,
    autoPrice,
    bankOptionsInCreditPrice,
    downPayment,
    equipmentInCreditPrice,
    getPreliminaryPaymentScheduleFormMutate,
    incomeProduct,
    monthlyPayment,
    overpayment,
    productName,
    pskPrc,
    rate,
    servicesInCreditPrice,
    term,
  ])

  return (
    <>
      <AreaContainer>
        <Box className={classes.blockContainer}>
          <SberTypography gridColumn="span 2" sberautoVariant="h5" component="p">
            Информация
          </SberTypography>
          <Box className={classes.actionsContainer} gridColumn="span 5">
            {(statusCode === StatusCode.APPROVED ||
              statusCode === StatusCode.FINALLY_APPROVED ||
              statusCode === StatusCode.REJECTED) &&
              !!emailId && (
                <Button
                  variant="text"
                  onClick={handleSendEmailBtnClick}
                  className={classes.sendEmailBtn}
                  disabled={isSendEmailDecisionLoading}
                  startIcon={
                    isSendEmailDecisionLoading ? (
                      <CircularProgressWheel />
                    ) : (
                      <MailIcon className={classes.sendEmailBtnIcon} />
                    )
                  }
                >
                  <SberTypography sberautoVariant="body3" component="p">
                    Отправить решение
                  </SberTypography>
                </Button>
              )}
            {status === PreparedStatus.approved && (
              <Downloader onDownloadFile={handleShareClick} icon={<DownloadIcon />}>
                <SberTypography sberautoVariant="body3" component="p">
                  Скачать
                </SberTypography>
              </Downloader>
            )}
          </Box>

          <ApplicationWarning
            statusCode={statusCode}
            errorDescription={errorDescription}
            isGovProgramDocumentsNecessaryRequest={isGovProgramDocumentsNecessaryRequest}
            isGovProgramDocumentsPending={isGovProgramDocumentsPending}
          />

          {appType === ApplicationSource.CAR_LOAN_APPLICATION_DC && (
            <Box className={classes.infoTextContainer} gridColumn="span 7">
              <InfoText label="ДЦ">
                {vendorCode && <SberTypography component="span">{vendorCode}&nbsp;</SberTypography>}
                {vendorInfo}
              </InfoText>
            </Box>
          )}

          {appType === ApplicationSource.CAR_LOAN_APPLICATION_DC && (
            <Box className={classes.infoTextContainer} gridColumn="span 2">
              <InfoText label="Марка / модель">
                {carBrand} {carModel}
              </InfoText>
              <SberTypography sberautoVariant="body3" component="p">
                {isCarNew === true ? 'Новая' : 'Б/У'}
              </SberTypography>
            </Box>
          )}
          <InfoText label="Стоимость авто">{formatMoney(autoPrice)}</InfoText>
          <InfoText label="Сумма кредита">{formatMoney(creditAmount)}</InfoText>
          <InfoText label="Платеж">{formatMoney(monthlyPayment)}</InfoText>
          {appType === ApplicationSource.CAR_LOAN_APPLICATION_DC && (
            <InfoText label="ПВ">{formatMoney(downPayment)}</InfoText>
          )}
          <InfoText label="Переплата">{formatMoney(overpayment)}</InfoText>
          {appType === ApplicationSource.CAR_LOAN_APPLICATION_DC && (
            <Box className={classes.infoTextContainer} gridColumn="span 2">
              <InfoText label="Кредитный продукт">{productName}</InfoText>
            </Box>
          )}

          <InfoText label="Сумма продуктов">{formatMoney(productSum)}</InfoText>
          <InfoText label="Срок кредита">{formatTerm(term)}</InfoText>
          <InfoText label="% ставка">
            {checkIsNumber(rate) ? Math.round((rate as number) * 100) / 100 : ''}%
          </InfoText>
          {appType !== ApplicationSource.CAR_LOAN_APPLICATION_DC && (
            <Box className={classes.infoTextContainer} gridColumn="span 2">
              <InfoText label="Кредитный продукт">{productName}</InfoText>
            </Box>
          )}

          {isShowScheduleBtn && isHasFeeScheduleInScans && (
            <FeeScheduleBtn
              onClick={handleSavedPreliminaryFeeScheduleClick}
              disabled={isDisableScheduleBtn}
            />
          )}
          {isShowScheduleBtn && !isHasFeeScheduleInScans && (
            <FeeScheduleBtn onClick={handlePreliminaryFeeScheduleClick} disabled={isDisableScheduleBtn} />
          )}
        </Box>
      </AreaContainer>

      {appType === ApplicationSource.CAR_LOAN_APPLICATION_DC && (
        <>
          <AdditionalOptionList title="Дополнительное оборудование" options={additionalEquipment} />
          <AdditionalOptionList title="Дополнительные услуги дилера" options={dealerServices} />
          <AdditionalOptionList title="Дополнительные услуги банка" options={bankServices} />
        </>
      )}
    </>
  )
}
