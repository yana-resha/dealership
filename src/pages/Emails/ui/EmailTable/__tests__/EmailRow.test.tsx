import { PropsWithChildren } from 'react'

import { EmailStatusCode } from '@sberauto/emailappdc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { mockedPreparedEmails } from 'entities/email/hooks/__tests__/useGetEmailsQuery.mock'
import { ThemeProviderMock } from 'tests/mocks'

import { EmailRow } from '../EmailRow'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

const mockedOnRowClick = jest.fn()

describe('EmailRow', () => {
  it('Отображаются все данные строки', () => {
    render(<EmailRow row={mockedPreparedEmails.emails[0]} onRowClick={mockedOnRowClick} />, {
      wrapper: createWrapper,
    })
    expect(screen.queryByText(mockedPreparedEmails.emails[0].from as string)).toBeInTheDocument()
    expect(screen.queryByText(mockedPreparedEmails.emails[0].topic as string)).toBeInTheDocument()
    expect(screen.queryByText('14.06.2024 09:51')).toBeInTheDocument()
    expect(screen.queryByText('Заявка создана')).toBeInTheDocument()
    expect(screen.queryByText(mockedPreparedEmails.emails[0].dcAppId as string)).toBeInTheDocument()
  })

  it('Если status=ANSWERED, то отображается статус Решение отправлено', () => {
    render(
      <EmailRow
        row={{ ...mockedPreparedEmails.emails[0], status: EmailStatusCode.ANSWERED }}
        onRowClick={mockedOnRowClick}
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.queryByText('Решение отправлено')).toBeInTheDocument()
  })

  it('Если status=INITIAL, то статус не отображается', () => {
    render(
      <EmailRow
        row={{ ...mockedPreparedEmails.emails[0], status: EmailStatusCode.INITIAL }}
        onRowClick={mockedOnRowClick}
      />,
      {
        wrapper: createWrapper,
      },
    )
    const status = screen.queryByTestId('dealershipclient.Emails.EmailTable.EmailStatus')
    expect(status).toBeEmptyDOMElement()
  })

  it('При клике на строку вызывается onRowClick', () => {
    render(<EmailRow row={mockedPreparedEmails.emails[0]} onRowClick={mockedOnRowClick} />, {
      wrapper: createWrapper,
    })
    const row = screen.getByTestId('dealershipclient.Emails.EmailTable.EmailRow')
    userEvent.click(row)
    expect(mockedOnRowClick).toHaveBeenCalledWith(mockedPreparedEmails.emails[0].emailId)
  })
})
