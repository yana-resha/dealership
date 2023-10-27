import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
// import { MockStore } from 'redux-mock-store'
// import * as routeData from 'react-router-dom'
// import reactRouterDom from 'react-router-dom'

import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { Calculator } from '../Calculator'

disableConsole('error')

describe('Calculator', () => {
  it('Изначально отображается только форма Малого калькулятора калькулятора', () => {
    render(<Calculator nextStep={jest.fn} />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MockProviders initialEntries={[{ state: { isFullCalculator: false } }]}>{children}</MockProviders>
      ),
    })
    expect(screen.getByTestId('orderCalculatorForm')).toBeInTheDocument()
    expect(screen.queryByTestId('bankOffers')).not.toBeInTheDocument()
  })

  it('Изначально отображается только форма Большого калькулятора', () => {
    render(<Calculator nextStep={jest.fn} />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MockProviders initialEntries={[{ state: { isFullCalculator: true } }]}>{children}</MockProviders>
      ),
    })

    expect(screen.getByTestId('fullOrderCalculatorForm')).toBeInTheDocument()
    expect(screen.queryByTestId('bankOffers')).not.toBeInTheDocument()
  })
})
