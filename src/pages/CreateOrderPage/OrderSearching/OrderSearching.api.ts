import { IsClientRequest, createLoanAppLifeCycleDc } from '@sberauto/loanapplifecycledc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client/client'

const loanAppLifeCycleDcApi = createLoanAppLifeCycleDc(`${appConfig.apiUrl}`, Rest.request)

//TODO DCB-194: Убрать мок из ответа
export const checkIfSberClient = (params: IsClientRequest) =>
  loanAppLifeCycleDcApi
    .isClient({ data: params })
    .then(response => response.data ?? {})
    .catch(() => ({ isClient: false }))

export const useCheckIfSberClientMutation = () =>
  useMutation(['isClient'], (params: IsClientRequest) => checkIfSberClient(params))
