import { useQuery } from 'react-query'

import { getUser } from './requests'

export const useGetUser = () =>
  useQuery(['getUser'], () => getUser({}), {
    cacheTime: Infinity,
  })
