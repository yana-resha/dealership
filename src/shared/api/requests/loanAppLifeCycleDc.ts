import {
  IsClientRequest,
  createLoanAppLifeCycleDc,
  GetVendorsListRequest,
  SaveLoanApplicationDraftRequest,
  ApplicationFrontdc,
  FindApplicationsRequest,
  Application,
  StatusCode,
  GetFullApplicationRequest,
} from '@sberauto/loanapplifecycledc-proto/public'
import { UseQueryOptions, useMutation, useQuery } from 'react-query'

import { appConfig } from 'config'

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

export const useCheckIfSberClientMutation = () =>
  useMutation(['checkIfSberClient'], (params: IsClientRequest) => checkIfSberClient(params))

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

const getFullApplication = (params: GetFullApplicationRequest) =>
  loanAppLifeCycleDcApi
    .getFullApplication({ data: params })
    .then(response => (response.data ?? {}) as GetFullApplicationResponse)
    .catch(() => fullApplicationData)

export const useGetFullApplicationQuery = (
  params: GetFullApplicationRequest,
  options?: UseQueryOptions<GetFullApplicationResponse, unknown, GetFullApplicationResponse, string[]>,
) =>
  useQuery(['getFullApplication'], () => getFullApplication(params), {
    retry: false,
    ...options,
  })
