// TODO DCB-193: данный api используется в разных местах:
// в common/findApplication/FindApplication и в common/OrderSearching.
// Сделать рефакторинг - вынести в shared
import { createApi } from '@reduxjs/toolkit/query/react'
import { FindApplicationsResponse, FindApplicationsRequest } from '@sberauto/loanapplifecycledc-proto/public'

import { appConfig } from 'config'

import { PreparedTableData } from '../../../entities/application/ApplicationTable/ApplicationTable.types'
import { defaultBaseQuery } from '../../../shared/api/helpers/defaultBaseQuery'
import { dataMock } from './__tests__/FindApplication.mock'
import { transformResToTableData } from './FindApplication.utils'

export const appLifeCycleApi = createApi({
  reducerPath: 'findApplications',
  // TODO DCB-198 : когда перестанет возвращаться 401ая, то убрать +mock
  baseQuery: defaultBaseQuery({ baseUrl: `${appConfig.apiUrl}+mock` }),
  tagTypes: ['findApplications'],
  endpoints: build => ({
    findApplications: build.query<PreparedTableData[], FindApplicationsRequest>({
      query: body => ({
        url: '/findApplications',
        body,
      }),
      transformResponse: (response: FindApplicationsResponse) =>
        transformResToTableData(response.applicationList ?? []),
      providesTags: ['findApplications'],
      //NOTE: добавить обработку ошибок, когда будет понимание по ошибкам DCB-123
      transformErrorResponse: () => transformResToTableData(dataMock),
    }),
  }),
})

export const { useFindApplicationsQuery } = appLifeCycleApi
