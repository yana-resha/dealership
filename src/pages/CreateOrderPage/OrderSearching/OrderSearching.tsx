import { useCallback, useState } from 'react'

import { IsClientRequest, IsClientResponse } from '@sberauto/loanapplifecycledc-proto/public'

import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { OrderForm } from 'pages/CreateOrderPage/OrderSearching/OrderForm'

import { useFindApplications } from './hooks/useFindApplications'
import { NoMatchesModal } from './NoMatchesModal/NoMatchesModal'
import { useCheckIfSberClientMutation } from './OrderSearching.api'

type Props = {
  nextStep: () => void
  onApplicationOpen: (applicationId: string) => void
}

export function OrderSearching({ nextStep, onApplicationOpen }: Props) {
  const [isVisibleModal, setVisibleModal] = useState(false)
  const openModal = useCallback(() => {
    setVisibleModal(true)
  }, [])
  const closeModal = useCallback(() => setVisibleModal(false), [])

  const [shouldDataFetch, setShouldDataFetch] = useState(false)

  const [initialIsClientRequest, setInitialIsClientRequest] = useState<IsClientRequest | undefined>()
  const findOrders = useCallback((data: IsClientRequest) => {
    setInitialIsClientRequest(data)
    setShouldDataFetch(true)
  }, [])

  const { isSuccessFindApplicationsQuery, isErrorFindApplicationsQuery, IsClientRequest } =
    useFindApplications(shouldDataFetch, initialIsClientRequest)

  const { mutateAsync: checkIfSberClientMutateAsync } = useCheckIfSberClientMutation()

  const checkClient = useCallback(
    async (data: IsClientRequest) => {
      // TODO DCB-194: Переделать работу с error на data, возможно лучше использовать onSucces
      const res = (await checkIfSberClientMutateAsync(data)) as { error: IsClientResponse }
      if (!res.error?.isClient) {
        openModal()
      }
    },
    [checkIfSberClientMutateAsync, openModal],
  )

  return (
    <>
      <OrderForm onSubmit={findOrders} />
      {isErrorFindApplicationsQuery && (
        <OrderForm isNewOrder onSubmit={checkClient} initialData={initialIsClientRequest} />
      )}

      {isSuccessFindApplicationsQuery && !!IsClientRequest?.length && (
        <ApplicationTable
          // TODO DCB-194: Slice использован как временное решение на период работы с моками,
          // т.к. столько строк не нужно
          // Убрать slice.метод при интеграции с бэком
          data={IsClientRequest.slice(0, 3)}
          isLoading={false}
          rowsPerPage={-1}
          onClickRow={onApplicationOpen}
        />
      )}

      <NoMatchesModal isVisible={isVisibleModal} onClose={closeModal} />
    </>
  )
}
