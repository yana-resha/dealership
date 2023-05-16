import { IsClientRequest } from '@sberauto/loanapplifecycledc-proto/public'

import { useFindApplicationsQuery } from 'common/findApplication/FindApplication/FindApplication.api'

export function useFindApplications(
  shouldDataFetch: boolean,
  initialIsClientRequest: IsClientRequest | undefined,
) {
  const { data, isSuccess, isError } = useFindApplicationsQuery(
    { ...initialIsClientRequest },
    { skip: !shouldDataFetch || !initialIsClientRequest },
  )

  return {
    isSuccessFindApplicationsQuery: isSuccess,
    isErrorFindApplicationsQuery: isError,
    IsClientRequest: data,
  }
}
