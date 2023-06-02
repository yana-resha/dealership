import {
  IsClientRequest,
  createLoanAppLifeCycleDc,
  GetVendorsListRequest,
  SaveLoanApplicationDraftRequest,
  ApplicationFrontdc,
} from '@sberauto/loanapplifecycledc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'

import { Rest } from '../client'

const loanapplifecycledcApi = createLoanAppLifeCycleDc(
  () => `${appConfig.apiUrl}/loanapplifecycledc`,
  Rest.request,
)

export const checkIfSberClient = (params: IsClientRequest) =>
  loanapplifecycledcApi.isClient({ data: params }).then(response => response.data ?? {})

export const getVendorsList = (params: GetVendorsListRequest) =>
  loanapplifecycledcApi.getVendorsList({ data: params }).then(response => response.data ?? {})

export const saveLoanApplicationDraft = (params: SaveLoanApplicationDraftRequest) =>
  loanapplifecycledcApi.saveLoanApplicationDraft({ data: params }).then(response => response.data ?? {})

export const useCheckIfSberClientMutation = () =>
  useMutation(['checkIfSberClient'], (params: IsClientRequest) => checkIfSberClient(params))

export const useSaveDraftApplicationMutation = () =>
  useMutation(['saveLoanApplicationDraft'], (params: ApplicationFrontdc) =>
    saveLoanApplicationDraft({ application: params }),
  )
