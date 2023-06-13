import { useQuery } from 'react-query'

import { getVendorsList } from 'shared/api/requests/loanAppLifeCycleDc'

export const useGetVendorsListQuery = () =>
  useQuery(['getVendorsList'], () => getVendorsList({}), {
    cacheTime: Infinity,

    select: response => response.vendors ?? [],
  })