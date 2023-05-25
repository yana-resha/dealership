import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestParent } from './createContext.mock'

describe('createContext', () => {
  beforeEach(() => {
    render(<TestParent />)
  })

  it('Значения передаются в дочернии компоненты', () => {
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('Значения изменяются из дочерних компонентов', async () => {
    const btn = screen.getByText('test')
    expect(btn).toBeInTheDocument()
    userEvent.click(btn)

    expect(screen.queryByText('test')).not.toBeInTheDocument()
    expect(await screen.findByText('newTestValue')).toBeInTheDocument()
  })
})
