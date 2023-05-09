import { createLoanAppLifeCycleDc } from '@sberauto/loanapplifecycledc-proto/public'
import { appConfig } from 'config'
import { useMutation } from 'react-query'

import { PreparedTableData } from 'entities/BankOffers'
import { Rest } from 'shared/api/client/client'

import { dataMock } from './__tests__/OrderSettings.test.mock'

const loanAppLifeCycleDcApi = createLoanAppLifeCycleDc(`${appConfig.apiUrl}`, Rest.request)

//TODO DCB-200: Убрать мок из ответа
export const calculateCredit = (params: any) =>
  new Promise<{ data: PreparedTableData[] }>(resolve => resolve({ data: dataMock })).then(
    response => response.data ?? {},
  )

export const useCalculateCreditMutation = () =>
  useMutation(['calculateCredit'], (params: any) => calculateCredit(params))
