import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { OrderCalculator } from '../OrderCalculator'

disableConsole('error')

describe('Calculator', () => {
  it('Изначально отображается только форма Малого калькулятора калькулятора', () => {
    render(<OrderCalculator nextStep={jest.fn} />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MockProviders initialEntries={[{ state: { isFullCalculator: false } }]}>{children}</MockProviders>
      ),
    })
    expect(screen.getByTestId('orderCalculatorForm')).toBeInTheDocument()
    expect(screen.queryByTestId('bankOffers')).not.toBeInTheDocument()
  })

  it('Изначально отображается только форма Большого калькулятора', () => {
    render(<OrderCalculator nextStep={jest.fn} />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MockProviders initialEntries={[{ state: { isFullCalculator: true } }]}>{children}</MockProviders>
      ),
    })

    expect(screen.getByTestId('fullOrderCalculatorForm')).toBeInTheDocument()
    expect(screen.queryByTestId('bankOffers')).not.toBeInTheDocument()
  })
})
