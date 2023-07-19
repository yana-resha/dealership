import {
  AddressType,
  ApplicantDocsType,
  Application,
  ApplicationFrontdc,
  OptionType,
  createLoanAppLifeCycleDc,
  FindApplicationsRequest,
  GetFullApplicationRequest,
  GetFullApplicationResponse,
  GetVendorsListRequest,
  IncomeDocumentType,
  IsClientRequest,
  MaritalStatus,
  OccupationType,
  PhoneType,
  SaveLoanApplicationDraftRequest,
  SendApplicationToScoringRequest,
  Sex,
  StatusCode,
  SendApplicationToFinancingRequest,
} from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { useDispatch } from 'react-redux'

import { appConfig } from 'config'
import { setOrder } from 'entities/reduxStore/orderSlice'

import { Rest } from '../client'

/** С прото проблема, бэк отправляет число, но в прото преобразуется в строку,
 * поэтому приводим к изначальному виду */
function prepareStatusCode(status: keyof typeof StatusCode): StatusCode {
  return StatusCode[status] ?? StatusCode.ERROR
}

function prepareApplication(application: Application): Application {
  return {
    ...application,
    status: prepareStatusCode(application.status as unknown as keyof typeof StatusCode),
  }
}

const loanAppLifeCycleDcApi = createLoanAppLifeCycleDc(
  () => `${appConfig.apiUrl}/loanapplifecycledc`,
  Rest.request,
)

export const checkIfSberClient = (params: IsClientRequest) =>
  loanAppLifeCycleDcApi.isClient({ data: params }).then(response => response.data ?? {})

export const getVendorsList = (params: GetVendorsListRequest) =>
  loanAppLifeCycleDcApi.getVendorsList({ data: params }).then(response => response.data ?? {})

export const saveLoanApplicationDraft = (params: SaveLoanApplicationDraftRequest) =>
  loanAppLifeCycleDcApi.saveLoanApplicationDraft({ data: params }).then(response => response.data ?? {})

export const sendApplicationToScore = (params: SendApplicationToScoringRequest) =>
  loanAppLifeCycleDcApi.sendApplicationToScoring({ data: params }).then(response => response.data ?? {})

export const useSendApplicationToScore = ({ onSuccess }: { onSuccess: () => void }) => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(
    ['sendApplicationToScore'],
    (params: SendApplicationToScoringRequest) => sendApplicationToScore(params),
    {
      onSuccess: () => onSuccess(),
      onError: () => {
        enqueueSnackbar('Ошибка. Не удалось отправить заявку на решение. Попробуйте позже', {
          variant: 'error',
        })
      },
    },
  )
}

export const useCheckIfSberClient = (params: IsClientRequest) =>
  useMutation(['checkIfSberClient'], () => checkIfSberClient(params))

export const useSaveDraftApplicationMutation = (onSuccess: (value: string) => void) => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(
    ['saveLoanApplicationDraft'],
    (params: ApplicationFrontdc) => saveLoanApplicationDraft({ application: params }),
    {
      onSuccess: response => {
        onSuccess(response.dcAppId ?? '')
      },
      onError: () => {
        enqueueSnackbar('Ошибка. Не удалось сохранить черновик заявки', {
          variant: 'error',
        })
      },
    },
  )
}

/** TODO DCB-198 : когда перестанет возвращаться 401ая, то убрать +mock
 * Импортировать loanapplifecycledcApi из shared/api */
// const mockLoanapplifecycledcApi = createLoanAppLifeCycleDc(`${appConfig.apiUrl}+mock`, Rest.request)

export const findApplications = (params: FindApplicationsRequest) =>
  loanAppLifeCycleDcApi.findApplications({ data: params }).then(response => {
    const { data } = response || {}
    const { applicationList } = data || {}

    return {
      applicationList: applicationList?.map(prepareApplication),
    }
  })

const getPreparedApplication = (data: GetFullApplicationResponse): GetFullApplicationResponse => {
  const status = data.application?.status as unknown as keyof typeof StatusCode
  const applicant = data.application?.applicant
    ? {
        ...data.application?.applicant,
        sex: data.application?.applicant.sex
          ? Sex[data.application?.applicant.sex as unknown as keyof typeof Sex]
          : data.application?.applicant.sex,
        marital: data.application?.applicant.marital
          ? MaritalStatus[data.application?.applicant.marital as unknown as keyof typeof MaritalStatus]
          : data.application?.applicant.marital,
        documents:
          data.application?.applicant.documents?.map(d => ({
            ...d,
            type: d.type ? ApplicantDocsType[d.type as unknown as keyof typeof ApplicantDocsType] : d.type,
          })) || data.application?.applicant.documents,
        phones:
          data.application?.applicant.phones?.map(p => ({
            ...p,
            type: p.type ? PhoneType[p.type as unknown as keyof typeof PhoneType] : p.type,
          })) || data.application?.applicant.phones,
        addresses:
          data.application?.applicant.addresses?.map(a => ({
            ...a,
            type: a.type ? AddressType[a.type as unknown as keyof typeof AddressType] : a.type,
          })) || data.application?.applicant.addresses,
        employment: data.application?.applicant.employment
          ? {
              ...data.application?.applicant.employment,
              occupation: data.application?.applicant.employment.occupation
                ? OccupationType[
                    data.application?.applicant.employment
                      .occupation as unknown as keyof typeof OccupationType
                  ]
                : data.application?.applicant.employment.occupation,
            }
          : data.application?.applicant.employment,
        income: data.application?.applicant.income
          ? {
              ...data.application?.applicant.income,
              incomeDocumentType: data.application?.applicant.income.incomeDocumentType
                ? IncomeDocumentType[
                    data.application?.applicant.income
                      .incomeDocumentType as unknown as keyof typeof IncomeDocumentType
                  ]
                : data.application?.applicant.income.incomeDocumentType,
            }
          : data.application?.applicant.income,
      }
    : data.application?.applicant

  const loanData = data.application?.loanData
    ? {
        ...data.application?.loanData,
        additionalOptions:
          data.application?.loanData.additionalOptions?.map(o => ({
            ...o,
            bankOptionType: o.bankOptionType
              ? OptionType[o.bankOptionType as unknown as keyof typeof OptionType]
              : o.bankOptionType,
          })) || data.application?.loanData.additionalOptions,
      }
    : data.application?.loanData

  return { ...data, application: { ...data.application, status: StatusCode[status], applicant, loanData } }
}

const getFullApplication = (params: GetFullApplicationRequest) =>
  loanAppLifeCycleDcApi
    .getFullApplication({ data: params })
    .then(response => (response.data ? getPreparedApplication(response.data) : response.data))

export const useGetFullApplicationQuery = (
  params: GetFullApplicationRequest,
  options?: UseQueryOptions<GetFullApplicationResponse, unknown, GetFullApplicationResponse, string[]>,
) => {
  const dispatch = useDispatch()

  return useQuery(['getFullApplication', params.applicationId || ''], () => getFullApplication(params), {
    retry: false,
    onSuccess: response => dispatch(setOrder({ orderData: response })),
    ...options,
  })
}

export const sendApplicationToFinancing = (params: SendApplicationToFinancingRequest) =>
  loanAppLifeCycleDcApi.sendApplicationToFinancing({ data: params })

export const useSendToFinancingMutation = () =>
  useMutation('sendApplicationToFinancing', sendApplicationToFinancing)
