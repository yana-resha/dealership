import { createApi } from '@reduxjs/toolkit/query/react'
import {
  GetVendorsListRequest,
  GetVendorsListResponse,
  Vendor,
} from '@sberauto/loanapplifecycledc-proto/public'

import { appConfig } from 'config'

import { defaultBaseQuery } from './helpers/defaultBaseQuery'

export const pointsOfSaleApi = createApi({
  reducerPath: 'pointsOfSaleApi',
  baseQuery: defaultBaseQuery({ baseUrl: `${appConfig.apiUrl}/loanapplifecycledc` }),
  tagTypes: ['pointsOfSale'],
  endpoints: build => ({
    getVendorsList: build.query<Vendor[], GetVendorsListRequest>({
      query: body => ({
        url: '/getVendorsList',
        body,
      }),
      transformResponse: (response: GetVendorsListResponse) => response.vendors ?? [],
      providesTags: ['pointsOfSale'],
      transformErrorResponse: () => mockResponse() ?? [],
    }),
  }),
})

export const { useGetVendorsListQuery } = pointsOfSaleApi

async function mockResponse() {
  const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await sleep(3000)

  return JSON.parse(
    '[\n' +
      '         {\n' +
      '            "vendorCode":"2002852",\n' +
      '            "vendorName":"Сармат",\n' +
      '            "cityName":"Ханты-Мансийск",\n' +
      '            "houseNumber":"4",\n' +
      '            "streetName":"Зябликова"\n' +
      '         },\n' +
      '         {\n' +
      '            "vendorCode":"4003390",\n' +
      '            "vendorName":"ХимкиАвто",\n' +
      '            "cityName":"Саратов",\n' +
      '            "houseNumber":"2",\n' +
      '            "streetName":"Симонова"\n' +
      '         },\n' +
      '         {\n' +
      '            "vendorCode":"3444920",\n' +
      '            "vendorName":"СайгакФорд",\n' +
      '            "cityName":"Москва",\n' +
      '            "houseNumber":"4",\n' +
      '            "streetName":"Курдюка"\n' +
      '         }\n' +
      '      ]',
  )
}
