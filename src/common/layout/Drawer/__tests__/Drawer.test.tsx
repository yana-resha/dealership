import React from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { CustomDrawer } from '../Drawer'

jest.mock('../subcomponents/NavigationMenu', () => ({
  NavigationMenu: () => <div data-testid="mockNavigationMenu" />
}))

describe('CustomDrawer', () => {
  it('отрисовывает компонент NavigationMenu', () => {
    render(
      <MockProviders>
        <CustomDrawer />
      </MockProviders>
    )

    const navigationMenu = screen.getByTestId('mockNavigationMenu')
    expect(navigationMenu).toBeInTheDocument()
  })
})
