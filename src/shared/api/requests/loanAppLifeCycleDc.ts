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
  IsClientRequest,
  MaritalStatus,
  OccupationType,
  PhoneType,
  SaveLoanApplicationDraftRequest,
  SendApplicationToScoringRequest,
  Sex,
  StatusCode,
  SendApplicationToFinancingRequest,
  ChangeApplicationStatusRequest,
  UploadDocumentRequest,
  DocumentType,
  GetApplicationDocumentsListRequest,
  GetApplicationDocumentsListResponse,
  DownloadDocumentRequest,
} from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'

import { appConfig } from 'config'

import { Rest } from '../client'

/** С прото проблема, бэк отправляет число, но в прото преобразуется в строку,
 * поэтому приводим к изначальному виду */
function prepareStatusCode(status: keyof typeof StatusCode): StatusCode {
  return StatusCode[status] ?? StatusCode.ERROR
}

function prepareDocumentType(type: keyof typeof DocumentType): DocumentType {
  return DocumentType[type] ?? DocumentType.UNSPECIFIED
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

const updateApplicationStatus = (params: ChangeApplicationStatusRequest) =>
  loanAppLifeCycleDcApi.changeApplicationStatus({ data: params }).then(response => response.data ?? {})

export const checkIfSberClient = (params: IsClientRequest) =>
  loanAppLifeCycleDcApi.isClient({ data: params }).then(response => response.data ?? {})

export const getVendorsList = (params: GetVendorsListRequest) =>
  loanAppLifeCycleDcApi.getVendorsList({ data: params }).then(response => response.data ?? {})

export const saveLoanApplicationDraft = (params: SaveLoanApplicationDraftRequest) =>
  loanAppLifeCycleDcApi.saveLoanApplicationDraft({ data: params }).then(response => response.data ?? {})

export const sendApplicationToScore = (params: SendApplicationToScoringRequest) =>
  loanAppLifeCycleDcApi.sendApplicationToScoring({ data: params }).then(response => response.data ?? {})

export const useUpdateApplicationStatus = (appId: string, onSuccess: (statusCode: StatusCode) => void) => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(
    ['updateApplicationStatus'],
    (statusCode: StatusCode) =>
      updateApplicationStatus({
        dcAppId: appId,
        status: statusCode,
      }),
    {
      onSuccess: response => {
        if (response.status) {
          onSuccess(prepareStatusCode(response.status as unknown as keyof typeof StatusCode))
        }
      },
      onError: () => {
        enqueueSnackbar('Не удалось обновить статус, попробуйте снова', { variant: 'error' })
      },
    },
  )
}

type UploadDocumentRequestMod = Omit<UploadDocumentRequest, 'file'> & {
  file: File
}
export const uploadDocument = (data: UploadDocumentRequestMod) => {
  const url = `${appConfig.apiUrl}/loanapplifecycledc`
  const endpoint = 'uploadDocument'

  const formData = new FormData()
  formData.append('dc_app_id', data.dcAppId || '')
  formData.append('document_type', `${data.documentType}`)
  formData.append('file', data.file)

  return Rest.request(`${url}/${endpoint}`, { data: formData })
}

export const useUploadDocumentMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['uploadDocument'], (params: UploadDocumentRequestMod) => uploadDocument(params), {
    onError: () => {
      enqueueSnackbar('Ошибка. Не удалось отправить файл', {
        variant: 'error',
      })
    },
  })
}

function prepareApplicationDocumentType(response: GetApplicationDocumentsListResponse) {
  const uploadDocumentList = response.uploadDocumentList?.map(el => {
    const documentType = el.documentType
      ? prepareDocumentType(el.documentType as unknown as keyof typeof DocumentType)
      : undefined

    return {
      ...el,
      documentType,
    }
  })

  return { uploadDocumentList } as GetApplicationDocumentsListResponse
}

export const getApplicationDocumentsList = (params: GetApplicationDocumentsListRequest) =>
  loanAppLifeCycleDcApi
    .getApplicationDocumentsList({ data: params })
    .then(response => prepareApplicationDocumentType(response.data ?? {}))

/** Получение документа привязанного к заявке */
export const downloadDocument = (data: DownloadDocumentRequest): Promise<File> => {
  const url = `${appConfig.apiUrl}/loanapplifecycledc`
  const endpoint = 'downloadDocument'

  return Rest.request<DownloadDocumentRequest, File>(`${url}/${endpoint}`, {
    data,
    isResponseBlob: true,
  })
}

export const useDownloadDocumentMutation = () =>
  useMutation(['downloadDocument'], (params: DownloadDocumentRequest) => downloadDocument(params), {})

export const useGetApplicationDocumentsListMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(
    ['getApplicationDocumentsList'],
    (params: GetApplicationDocumentsListRequest) => getApplicationDocumentsList(params),
    {
      onError: () => {
        enqueueSnackbar('Ошибка. Не удалось отправить файл', {
          variant: 'error',
        })
      },
    },
  )
}

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
                ? DocumentType[
                    data.application?.applicant.income
                      .incomeDocumentType as unknown as keyof typeof DocumentType
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

  const scans = data.application?.scans?.map(scan => ({
    ...scan,
    type: prepareDocumentType(scan.type as unknown as keyof typeof DocumentType),
  }))

  return {
    ...data,
    application: { ...data.application, status: StatusCode[status], applicant, loanData, scans },
  }
}

const getFullApplication = (params: GetFullApplicationRequest) =>
  loanAppLifeCycleDcApi
    .getFullApplication({ data: params })
    .then(response => (response.data ? getPreparedApplication(response.data) : response.data))

export const useGetFullApplicationQuery = (
  params: GetFullApplicationRequest,
  options?: UseQueryOptions<GetFullApplicationResponse, unknown, GetFullApplicationResponse, string[]>,
) =>
  useQuery(['getFullApplication', params.applicationId || ''], () => getFullApplication(params), {
    retry: false,
    ...options,
  })

export const sendApplicationToFinancing = (params: SendApplicationToFinancingRequest) =>
  loanAppLifeCycleDcApi.sendApplicationToFinancing({ data: params })

export const useSendToFinancingMutation = () =>
  useMutation('sendApplicationToFinancing', sendApplicationToFinancing)
