import React from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { DefaultLayout } from '../DefaultLayout'

// Мокаем компонент Outlet из react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

  Outlet: () => <div data-testid="mockOutlet" />,
}))

describe('DefaultLayout', () => {
  it('отрисовывает компонент Outlet', () => {
    render(
      <MockProviders>
        <DefaultLayout />
      </MockProviders>,
    )

    const outlet = screen.getByTestId('mockOutlet')
    expect(outlet).toBeInTheDocument()
  })
})
