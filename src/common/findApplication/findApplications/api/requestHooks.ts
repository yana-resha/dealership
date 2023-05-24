import { createLoanAppLifeCycleDc, FindApplicationsRequest } from '@sberauto/loanapplifecycledc-proto/public'
import { useQuery } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

import { makeApplicationTableData } from '../utils/makeApplicationTableData'
import { findApplicationsDataMock } from './__tests__/requestHooks.mock'

/** TODO DCB-198 : когда перестанет возвращаться 401ая, то убрать +mock
 * Импортировать loanapplifecycledcApi из shared/api */
const loanapplifecycledcApi = createLoanAppLifeCycleDc(`${appConfig.apiUrl}+mock`, Rest.request)

export const useFindApplicationsQuery = (params: FindApplicationsRequest) =>
  useQuery(
    ['findApplications'],
    () => {
      loanapplifecycledcApi.findApplications({ data: params })
      const res = {
        data: {
          // TODO DCB-198: убрать логику if после интеграции, сейчас нужна что бы отлаживать разные сценарии
          applicationList: params.passportNumber === '111111' ? [] : findApplicationsDataMock,
        },
      }

      return res
      // TODO DCB-198 : когда перестанет возвращаться 401ая, то убрать +mock
      // return loanapplifecycledcApi.findApplications({ data: params })
    },
    {
      cacheTime: Infinity,

      select: response => makeApplicationTableData(response.data.applicationList ?? []),
    },
  )
