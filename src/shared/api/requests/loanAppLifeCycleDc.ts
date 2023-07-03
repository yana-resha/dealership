import {
  Application,
  ApplicationFrontdc,
  createLoanAppLifeCycleDc,
  FindApplicationsRequest,
  GetFullApplicationRequest,
  GetVendorsListRequest,
  IsClientRequest,
  SaveLoanApplicationDraftRequest,
  SendApplicationToScoringRequest,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { useDispatch } from 'react-redux'

import { appConfig } from 'config'
import { setOrder } from 'pages/CreateOrderPage/model/orderSlice'

import { Rest } from '../client'
import { fullApplicationData, GetFullApplicationResponse } from './loanAppLifeCycleDc.mock'

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
  loanAppLifeCycleDcApi
    .sendApplicationToScoring({ data: params })
    .then(response => response.data ?? {})
    .catch(response => response.errors ?? {})

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

export const useSaveDraftApplicationMutation = () =>
  useMutation(['saveLoanApplicationDraft'], (params: ApplicationFrontdc) =>
    saveLoanApplicationDraft({ application: params }),
  )

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

const getApplicationWithFixedStatus = (data: GetFullApplicationResponse): GetFullApplicationResponse => {
  const status = data.application?.status as unknown as keyof typeof StatusCode

  return { application: { ...data.application, status: StatusCode[status] } }
}

const getFullApplication = (params: GetFullApplicationRequest) =>
  loanAppLifeCycleDcApi
    .getFullApplication({ data: params })
    .then(response => getApplicationWithFixedStatus((response.data ?? {}) as GetFullApplicationResponse))
    .catch(() => fullApplicationData)

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
