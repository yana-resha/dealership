import {
  CalculateCreditRequest,
  GetCarsListRequest,
  GetCreditProductListRequest,
  GetVendorOptionsListRequest,
  createDictionaryDc,
  OptionType,
  GetRequisitesForFinancingRequest,
  CalculateCreditResponse,
  GetVendorsListRequest,
  RequiredServiceFlag,
  CalcType,
} from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { CustomFetchError, Rest } from 'shared/api/client'
import { prepareCalcType, prepareOptionType, prepareRequiredServiceFlag } from 'shared/lib/helpers'

import { Service, ServiceApi } from '../constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from '../errors'

const dictionaryDcApi = createDictionaryDc(`${appConfig.apiUrl}/${Service.Dictionarydc}`, Rest.request)

export const getCarsList = (params: GetCarsListRequest) =>
  dictionaryDcApi.getCarsList({ data: params }).then(res => res.data ?? {})

export const getCreditProductList = (params: GetCreditProductListRequest) =>
  dictionaryDcApi.getCreditProductList({ data: params }).then(res => res.data ?? {})

export const getVendorOptionsList = (params: GetVendorOptionsListRequest) =>
  dictionaryDcApi.getVendorOptionsList({ data: params }).then(response => {
    const additionalOptions = response.data.additionalOptions?.map(el => ({
      ...el,
      optionType: prepareOptionType(el.optionType as unknown as keyof typeof OptionType),
      tariffs: el.tariffs?.map(tariff => ({
        ...tariff,
        calcType: prepareCalcType(tariff.calcType as unknown as keyof typeof CalcType),
      })),
    }))

    return { ...(response.data ?? {}), additionalOptions }
  })

export const calculateCredit = (params: CalculateCreditRequest) =>
  dictionaryDcApi.calculateCredit({ data: params }).then(res => ({
    ...res.data,
    products: res.data?.products
      // По требованию аналитиков отфильтровываем продукт,
      //  если discountAvailability=false и rateDelta больше 0 https://wiki.x.sberauto.com/pages/viewpage.action?pageId=1068534196
      ?.filter(product => !(!product.discountAvailability && product.rateDelta))
      .map(product => ({
        ...product,
        requiredServiceFlag: prepareRequiredServiceFlag(
          product.requiredServiceFlag as unknown as keyof typeof RequiredServiceFlag,
        ),
      })),
  }))

export const useCalculateCreditMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation<CalculateCreditResponse, CustomFetchError, CalculateCreditRequest, unknown>(
    ['calculateCredit'],
    calculateCredit,
    {
      onError: err => {
        enqueueSnackbar(
          getErrorMessage({
            service: Service.Dictionarydc,
            serviceApi: ServiceApi.CALCULATE_CREDIT,
            code: err.code as ErrorCode,
            alias: err.alias as ErrorAlias,
          }),
          { variant: 'error' },
        )
      },
    },
  )
}

export const getRequisitesForFinancing = (params: GetRequisitesForFinancingRequest) =>
  dictionaryDcApi.getRequisitesForFinancing({ data: params }).then(res => res.data ?? {})

export const getVendorsList = (params: GetVendorsListRequest) =>
  dictionaryDcApi.getVendorsList({ data: params }).then(response => response.data ?? {})
