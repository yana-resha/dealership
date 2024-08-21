import { useCallback } from 'react'

import { GetCreditProductListRequest } from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryResult, useQuery } from 'react-query'

import { updateOrder } from 'entities/order'
import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'
import { getCreditProductList } from 'shared/api/requests/dictionaryDc.api'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { convertedDateToString } from 'shared/utils/dateTransform'
import { stringToNumber } from 'shared/utils/stringToNumber'

import {
  FullOrderCalculatorFields,
  BriefOrderCalculatorFields,
  UseGetCreditProductListQueryData,
} from '../types'
import { prepareCreditProducts } from '../utils/prepareCreditProductListData'

const isFullOrderCalculatorFieldsType = (obj: any): obj is FullOrderCalculatorFields =>
  obj && 'carPassportType' in obj && 'carPassportCreationDate' in obj

type Params = {
  vendorCode: string | undefined
  values: BriefOrderCalculatorFields | FullOrderCalculatorFields
  enabled?: boolean
}
export const useGetCreditProductListQuery = ({
  vendorCode,
  values,
  enabled = true,
}: Params): UseQueryResult<UseGetCreditProductListQueryData, unknown> => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    (err: CustomFetchError) =>
      enqueueSnackbar(
        getErrorMessage({
          service: Service.Dictionarydc,
          serviceApi: ServiceApi.GET_CREDIT_PRODUCT_LIST,
          code: err.code as ErrorCode,
          alias: err.alias as ErrorAlias,
        }),
        { variant: 'error' },
      ),
    [enqueueSnackbar],
  )

  const params: GetCreditProductListRequest = {
    vendorCode,
    model: values?.carModel || '',
    brand: values?.carBrand || '',
    isCarNew: !!values?.carCondition,
    autoCreateYear: values?.carYear ?? undefined,
    govprogramFlag: values?.isGovernmentProgram,
    govprogramDfoFlag: values?.isDfoProgram,
    carCost: stringToNumber(values?.carCost),
    ptsDate: isFullOrderCalculatorFieldsType(values)
      ? convertedDateToString(values?.carPassportCreationDate)
      : undefined,
  }

  const res = useQuery(['getCreditProductList', params], () => getCreditProductList(params), {
    refetchOnWindowFocus: false,
    select: res => ({
      ...res,
      ...prepareCreditProducts(res.creditProducts),
    }),
    onError,
    onSuccess: res => {
      dispatch(
        updateOrder({
          productsMap: res?.productsMap || {},
          governmentProgramsMap: res?.governmentProgramsMap || {},
        }),
      )
    },
    enabled,
  })

  return res
}
