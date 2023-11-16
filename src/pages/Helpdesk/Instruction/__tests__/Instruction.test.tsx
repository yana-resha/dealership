import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { Instruction } from '../Instruction'
import { getMailBody } from '../Instruction.utils'
import { EXPECTED_MAIL_BODY, MAIL_FORM_FIELDS, MOCKED_USER, MOCKED_VENDOR_CODE } from './Instruction.mock'

jest.mock('common/auth/ui/LoginForm/LoginForm.tsx')

describe('Helpdesk', () => {
  it('Работает генерация тела письма', () => {
    expect(getMailBody(MOCKED_USER, MOCKED_VENDOR_CODE)).toEqual(EXPECTED_MAIL_BODY)
  })

  it('Отрисовывается весь состав полей для заявки', () => {
    render(
      <MockProviders>
        <Instruction />
      </MockProviders>,
    )

    for (const fieldName of MAIL_FORM_FIELDS) {
      expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
    }
  })
})
