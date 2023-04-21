import React from 'react'

import { render, screen, act } from '@testing-library/react'

import { MockThemeProviders } from 'tests/mocks'

import * as useTabManagementHooks from '../../../hooks/useTabManagement'
import * as tabManagementSelectors from '../../../model/selectors/slIsCurrentTabActive'
import { TabBlocker } from '../TabBlocker'

jest.mock('shared/hooks/store/useAppSelector', () => ({
  useAppSelector: (selector: () => any) => selector(),
}))

describe('TabBlocker', () => {
  let useTabManagementSpy: jest.SpyInstance
  let slIsCurrentTabActiveSpy: jest.SpyInstance

  beforeEach(() => {
    useTabManagementSpy = jest.spyOn(useTabManagementHooks, 'useTabManagement').mockImplementation(() => {})
    slIsCurrentTabActiveSpy = jest
      .spyOn(tabManagementSelectors, 'slIsCurrentTabActive')
      .mockImplementation(() => true)
  })

  afterEach(() => {
    jest.clearAllMocks()
    useTabManagementSpy.mockRestore()
    slIsCurrentTabActiveSpy.mockRestore()
  })

  it('не отображает блокировщик вкладок, когда вкладка активна', async () => {
    slIsCurrentTabActiveSpy.mockImplementation(() => true)

    render(
      <MockThemeProviders>
        <TabBlocker>
          <></>
        </TabBlocker>
      </MockThemeProviders>,
    )

    await act(async () => {
      // Ждем задержку перед появлением блокировщика вкладок
      await new Promise(resolve => setTimeout(resolve, 1500))
    })

    expect(screen.queryByTestId('blockedMessageAboutTabDuplicate')).toBeNull()
  })

  it('отображает блокировщик вкладок, когда вкладка неактивна', async () => {
    slIsCurrentTabActiveSpy.mockImplementation(() => false)

    render(
      <MockThemeProviders>
        <TabBlocker>
          <></>
        </TabBlocker>
      </MockThemeProviders>,
    )

    await act(async () => {
      // Ждем задержку перед появлением блокировщика вкладок
      await new Promise(resolve => setTimeout(resolve, 1000))
    })

    expect(screen.getByTestId('blockedMessageAboutTabDuplicate')).toBeInTheDocument()
  })
})
