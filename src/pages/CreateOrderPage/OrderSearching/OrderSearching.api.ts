import {
  createLoanAppLifeCycleDc,
  FindApplicationsRequest,
  FindApplicationsResponse,
  ResponseWrapper,
} from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'
import { useQuery } from 'react-query'

import { makeApplicationTableData } from 'common/findApplication/findApplications'
import { appConfig } from 'config'
import { Rest } from 'shared/api/client'
import { sleep } from 'shared/lib/sleep'

import { findApplicationsDataMock } from './__tests__/OrderSearching.test.mock'

/** TODO DCB-198 : когда перестанет возвращаться 401ая, то убрать +mock
 * Импортировать loanapplifecycledcApi из shared/api */
const loanapplifecycledcApiMock = createLoanAppLifeCycleDc(
  `${appConfig.apiUrl}+mock/loanapplifecycledc`,
  Rest.request,
)

export const useFindApplicationsQuery = (params: FindApplicationsRequest | undefined) => {
  const { enqueueSnackbar } = useSnackbar()

  const { data, isSuccess, isLoading, refetch } = useQuery(
    ['findSpecificApplications'],
    async () => {
      loanapplifecycledcApiMock.findApplications({ data: params ?? {} })
      await sleep(500)
      const res: ResponseWrapper<FindApplicationsResponse> | undefined = {
        success: true,
        data: {
          // TODO DCB-198: убрать логику if после интеграции, сейчас нужна что бы отлаживать разные сценарии
          applicationList: params?.passportNumber === '111111' ? [] : findApplicationsDataMock,
        },
      }

      return res
      // TODO DCB-198 : когда перестанет возвращаться 401ая, то раскомментить
      // return await loanapplifecycledcApi.findApplications({ data: params })
    },
    {
      cacheTime: Infinity,
      enabled: false,
      onError: () => enqueueSnackbar('Ошибка. Не удалось получить список заявок', { variant: 'error' }),

      select: response => {
        const res = makeApplicationTableData(response?.data?.applicationList ?? [])

        return res
      },
    },
  )

  return {
    data,
    isSuccess,
    isLoading,
    refetch,
  }
}
