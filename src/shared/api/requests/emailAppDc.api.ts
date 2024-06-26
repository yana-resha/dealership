import {
  createEmailappdc,
  DownloadEmailDocRequest,
  GetEmailsRequest,
  SendEmailDecisionRequest,
} from '@sberauto/emailappdc-proto/public'
import { useSnackbar } from 'notistack'
import { useMutation } from 'react-query'

import { appConfig } from '../../../config'
import { FILE_DOWNLOAD_ERROR } from '../../constants/constants'
import { prepareEmailStatus } from '../../lib/helpers'
import { CustomFetchError, Rest } from '../client'
import { Service, ServiceApi } from '../constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from '../errors'

const emailAppDcApi = createEmailappdc(`${appConfig.apiUrl}/${Service.EMAILAPPDC}`, Rest.request)
export const getEmails = (params: GetEmailsRequest) =>
  emailAppDcApi.getEmails({ data: params }).then(res => prepareEmailStatus(res.data ?? {}))

export const downloadEmailDoc = (data: DownloadEmailDocRequest): Promise<Blob> => {
  const url = `${appConfig.apiUrl}/${Service.EMAILAPPDC}`
  const endpoint = 'downloadEmailDoc'

  return Rest.request<DownloadEmailDocRequest, Blob>(`${url}/${endpoint}`, {
    data,
    isResponseBlob: true,
  })
}

export const useDownloadEmailDocMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['downloadEmailDoc'], (params: DownloadEmailDocRequest) => downloadEmailDoc(params), {
    onError: () => {
      enqueueSnackbar(FILE_DOWNLOAD_ERROR, {
        variant: 'error',
      })
    },
  })
}

export const sendEmailDecision = (params: SendEmailDecisionRequest) =>
  emailAppDcApi.sendEmailDecision({ data: params }).then(res => res.data ?? {})

export const useSendEmailDecisionMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['sendEmailDecision'], sendEmailDecision, {
    onSuccess: () => {
      enqueueSnackbar('Решение отправлено', {
        variant: 'success',
      })
    },
    onError: (err: CustomFetchError) => {
      enqueueSnackbar(
        getErrorMessage({
          service: Service.EMAILAPPDC,
          serviceApi: ServiceApi.SEND_EMAIL_DECISION,
          code: err.code as ErrorCode,
          alias: err.alias as ErrorAlias,
        }),
        {
          variant: 'error',
        },
      )
    },
  })
}
