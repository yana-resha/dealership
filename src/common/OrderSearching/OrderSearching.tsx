import { useCallback, useState } from 'react'

import { CheckIfSberClientResponse } from '@sberauto/loanapplifecycledc-proto/public'

import { OrderData, OrderForm } from 'common/OrderSearching/OrderForm'
import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { NoMatchesModal } from 'entities/NoMatchesModal'

import { useFindApplications } from './hooks/useFindApplications'
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

  const [initialOrderData, setInitialOrderData] = useState<OrderData | undefined>()
  const findOrders = useCallback((data: OrderData) => {
    setInitialOrderData(data)
    setShouldDataFetch(true)
  }, [])

  const { isSuccessFindApplicationsQuery, isErrorFindApplicationsQuery, orderData } = useFindApplications(
    shouldDataFetch,
    initialOrderData,
  )

  const checkIfSberClientMutation = useCheckIfSberClientMutation()

  const checkClient = useCallback(
    async (data: OrderData) => {
      // TODO DCB-194: Переделать работу с error на data
      const res = (await checkIfSberClientMutation.mutateAsync(data)) as { error: CheckIfSberClientResponse }
      if (!res.error?.isSberClient) {
        openModal()
      }
    },
    [checkIfSberClientMutation, openModal],
  )

  return (
    <>
      <OrderForm onSubmit={findOrders} />
      {isErrorFindApplicationsQuery && (
        <OrderForm isNewOrder onSubmit={checkClient} initialData={initialOrderData} />
      )}

      {isSuccessFindApplicationsQuery && !!orderData?.length && (
        <ApplicationTable
          // TODO DCB-194: Slice использован как временное решение на период работы с моками,
          // т.к. столько строк не нужно
          // Убрать slice.метод при интеграции с бэком
          data={orderData.slice(0, 3)}
          isLoading={false}
          rowsPerPage={-1}
          onClickRow={onApplicationOpen}
        />
      )}

      <NoMatchesModal isVisible={isVisibleModal} onClose={closeModal} />
    </>
  )
}
