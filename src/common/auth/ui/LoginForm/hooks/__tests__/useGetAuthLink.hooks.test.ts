import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

import * as authsberteamidApi from 'shared/api/requests/authsberteamid'
import { MockProviders } from 'tests/mocks'

import { useGetAuthLink } from '../useGetAuthLink'

jest.mock('js-cookie', () => ({
  remove: jest.fn(),
}))

const mockedUseStartAuthSessionQuery = jest.spyOn(authsberteamidApi, 'getStateAndNonce')

describe('useGetAuthLink', () => {
  it('После запроса параметров для авторизационной ссылки, сслыка подставляется в кнопку', async () => {
    mockedUseStartAuthSessionQuery.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                state: 'test_state',
                nonce: 'test_nonce',
                clientId: 'frontDC',
                redirectUri: 'dc.ru/auth',
                scope: 'username+phone+lastname',
              }),
            10,
          ),
        ),
    )

    const { result, waitForNextUpdate } = renderHook(() => useGetAuthLink(), { wrapper: MockProviders })

    await waitFor(() => result.current.authLink)
    await waitForNextUpdate()

    expect(result.current.authLink).toBeDefined()
  })
})
