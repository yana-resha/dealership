import { CheckIfSberClientRequest, createLoanAppLifeCycleDc } from '@sberauto/loanapplifecycledc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client/client'

const loanAppLifeCycleDcApi = createLoanAppLifeCycleDc(`${appConfig.apiUrl}`, Rest.request)

//TODO DCB-194: Убрать мок из ответа
export const checkIfSberClient = (params: CheckIfSberClientRequest) =>
  loanAppLifeCycleDcApi
    .checkIfSberClient({ data: params })
    .then(response => response.data ?? {})
    .catch(() => ({ isSberClient: false }))

export const useCheckIfSberClientMutation = () =>
  useMutation(['checkIfSberClient'], (params: CheckIfSberClientRequest) => checkIfSberClient(params))
