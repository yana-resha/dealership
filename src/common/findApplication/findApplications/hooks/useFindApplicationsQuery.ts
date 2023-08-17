import { useSnackbar } from 'notistack'
import { useQuery } from 'react-query'

import { findApplications } from 'shared/api/requests/loanAppLifeCycleDc'

import { makeApplicationTableData } from '../utils/makeApplicationTableData'

export const useFindApplicationsQuery = (
  params: Parameters<typeof findApplications>[0] | undefined,
  option?: {
    retry?: boolean
    enabled?: boolean
  },
) => {
  const { enqueueSnackbar } = useSnackbar()

  const { data, isSuccess, isLoading, refetch, remove } = useQuery(
    ['findApplications', params],
    () => findApplications(params ?? {}),
    {
      // кэш не позволяет обновить список, когда возвращаешься после отправки заявки на решение
      // staleTime: 1000 * 30,

      select: response => makeApplicationTableData(response.applicationList ?? []),
      onError: (err: any) => {
        if (err?.status !== 401) {
          enqueueSnackbar('Ошибка. Не удалось получить список заявок', { variant: 'error' })
        }
      },
      ...(option || {}),
    },
  )

  return {
    data,
    isSuccess,
    isLoading,
    refetch,
    remove,
  }
}
