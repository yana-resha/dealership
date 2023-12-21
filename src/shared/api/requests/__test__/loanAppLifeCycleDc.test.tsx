import { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { act, renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'

import { ThemeProviderMock } from 'tests/mocks'

import { useUpdateApplicationStatusMutation } from '../loanAppLifeCycleDc'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const createWrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProviderMock>{children}</ThemeProviderMock>
  </QueryClientProvider>
)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

describe('loanAppLifeCycleDc', () => {
  it('loanAppLifeCycleDc нельзя дернуть с параметром StatusCode.SIGNED и без параметра assignmentOfClaim', async () => {
    const { result, waitFor } = renderHook(() => useUpdateApplicationStatusMutation('', jest.fn), {
      wrapper: createWrapper,
    })
    act(() => {
      result.current.mutate({ statusCode: StatusCode.SIGNED })
    })
    await waitFor(() => result.current.isError)

    expect(result.current.isError).toBe(true)
    expect(result.current.data).toBe(undefined)
    expect((result.current.error as Error).message).toBe(
      'Не удалось обновить статус. Необходимо отметить Согласие/Несогласие на уступку прав',
    )
  })
})
