import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { FullOrderSettings } from '../FullOrderSettings'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

disableConsole('error')

describe('FullOrderSettings', () => {
  beforeEach(() => {
    render(<FullOrderSettings />, {
      wrapper: createWrapper,
    })
  })

  it('Изначально отображается только форма', () => {
    expect(screen.getByTestId('fullOrderCalculatorForm')).toBeInTheDocument()
    expect(screen.queryByTestId('bankOffers')).not.toBeInTheDocument()
  })
})
