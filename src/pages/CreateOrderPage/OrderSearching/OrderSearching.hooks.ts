import { useSnackbar } from 'notistack'
import { useMutation } from 'react-query'

import { checkIfSberClient } from 'shared/api/requests/loanapplifecycledc'

import { OrderData } from './components/OrderForm'

export const useCheckIfSberClient = ({
  onSuccess,
}: {
  onSuccess: (isClient: boolean, orderData?: OrderData) => void
}) => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['checkIfSberClient'], checkIfSberClient, {
    onError: () => {
      enqueueSnackbar('Ошибка. Не удалось создать заявку. Попробуйте позже', { variant: 'error' })
    },
    onSuccess: (response, request) => {
      onSuccess(!!response.isClient, request)
    },
  })
}
