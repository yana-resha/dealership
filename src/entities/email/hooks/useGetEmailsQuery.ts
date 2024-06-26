import { useCallback } from 'react'

import { Email, GetEmailsRequest, GetEmailsResponse } from '@sberauto/emailappdc-proto/public'
import { useSnackbar } from 'notistack'
import { useQuery, UseQueryOptions } from 'react-query'

import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'
import { getEmails } from 'shared/api/requests/emailAppDc.api'

import { PreparedEmailData, RequiredEmail } from '../types'

const EMAIL_UPDATE_PERIOD = 300000

export const prepareEmails = (initialEmails: Email[] | null | undefined) =>
  (initialEmails || []).reduce<PreparedEmailData>(
    (acc, cur) => {
      if (!cur.emailId) {
        return acc
      }
      acc.emails.push(cur as RequiredEmail)
      acc.emailsMap[cur.emailId] = cur as RequiredEmail

      return acc
    },
    { emails: [], emailsMap: {} },
  )

export const useGetEmailsQuery = (
  params: GetEmailsRequest,
  options?: UseQueryOptions<
    GetEmailsResponse,
    CustomFetchError,
    PreparedEmailData,
    (string | GetEmailsRequest)[]
  >,
) => {
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    (err: CustomFetchError) =>
      enqueueSnackbar(
        getErrorMessage({
          service: Service.EMAILAPPDC,
          serviceApi: ServiceApi.GET_EMAILS,
          code: err.code as ErrorCode,
          alias: err.alias as ErrorAlias,
        }),
        {
          variant: 'error',
        },
      ),
    [enqueueSnackbar],
  )

  return useQuery(['getEmails', params], () => getEmails(params), {
    retry: false,
    staleTime: EMAIL_UPDATE_PERIOD, // Почта с почтового сервера подтягивается в БД раз в 5 минут
    select: response => prepareEmails(response.emails),
    onError,
    ...options,
  })
}
