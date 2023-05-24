import { useQuery } from 'react-query'

import { getUser } from 'shared/api/requests/authdc'

export const useGetUserQuery = () =>
  useQuery(['getUser'], () => getUser({}), {
    cacheTime: Infinity,
  })
