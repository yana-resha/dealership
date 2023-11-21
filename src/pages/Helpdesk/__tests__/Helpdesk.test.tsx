import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { Helpdesk } from '../Helpdesk'

jest.mock('common/auth/ui/LoginForm/LoginForm.tsx')

describe('Helpdesk', () => {
  it('Отрисовывает Инструкции и Пример', () => {
    render(
      <MockProviders>
        <Helpdesk />
      </MockProviders>,
    )

    const instruction = screen.getByTestId('Instruction')
    const helpdeskExample = screen.getByTestId('HelpdeskExample')
    expect(instruction).toBeInTheDocument()
    expect(helpdeskExample).toBeInTheDocument()
  })
})
