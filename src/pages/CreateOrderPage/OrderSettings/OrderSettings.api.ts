import { CalculateCreditRequest, createDictionaryDc } from '@sberauto/dictionarydc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

import { mockCalculateCreditResponse } from './__tests__/OrderSettings.test.mock'

const dictionaryDcApi = createDictionaryDc(`${appConfig.apiUrl}`, Rest.request)

//TODO DCB-239: Убрать мок из ответа
export const calculateCredit = (params: CalculateCreditRequest) =>
  dictionaryDcApi
    .calculateCredit({ data: params })
    .then(response => response.data ?? {})
    .catch(() => mockCalculateCreditResponse())

export const useCalculateCreditMutation = () =>
  useMutation(['calculateCredit'], (params: CalculateCreditRequest) => calculateCredit(params))
