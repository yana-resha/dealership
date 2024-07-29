import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { mockedPreparedEmails } from 'entities/email/hooks/__tests__/useGetEmailsQuery.mock'
import { appRoutes } from 'shared/navigation/routerPath'
import { ThemeProviderMock } from 'tests/mocks'

import { EmailTable } from '../EmailTable'

jest.mock('pages/Emails/ui/EmailTable/EmailRow')

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

const mockedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

jest.mock('shared/hooks/useRowsPerPage', () => ({
  useRowsPerPage: ({ data }: { data: any[] }) => ({
    tableBodyRef: { current: null },
    currentRowData: data,
    emptyRows: 0,
    pageCount: 2,
    page: 1,
    rowsPerPage: 6,
    rowHeight: 56,
    setPage: jest.fn,
    handleChangePage: jest.fn,
  }),
}))

describe('EmailTable', () => {
  it('Если isLoading=true, то отображается лоадер - skeletons', () => {
    render(<EmailTable emails={mockedPreparedEmails.emails} isLoading={true} isFetched={true} />, {
      wrapper: createWrapper,
    })
    expect(screen.queryByTestId('dealershipclient.Emails.EmailTable.SkeletonContainer')).toBeInTheDocument()
    expect(screen.queryByTestId('dealershipclient.Emails.EmailTable')).not.toBeInTheDocument()
  })

  it('Если isLoading=true, то отображается лоадер - skeletons', () => {
    render(<EmailTable emails={[]} isLoading={false} isFetched={true} />, {
      wrapper: createWrapper,
    })
    expect(
      screen.queryByTestId('dealershipclient.Emails.EmailTable.SkeletonContainer'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('dealershipclient.Emails.EmailTable')).toBeInTheDocument()
    expect(screen.queryByText('Письма не найдены')).toBeInTheDocument()
  })

  it('Если isLoading=false и emails не пуст, то отображается таблица с письмами', () => {
    render(<EmailTable emails={mockedPreparedEmails.emails} isLoading={false} isFetched={true} />, {
      wrapper: createWrapper,
    })
    expect(
      screen.queryByTestId('dealershipclient.Emails.EmailTable.SkeletonContainer'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('dealershipclient.Emails.EmailTable')).toBeInTheDocument()
    expect(screen.getAllByTestId('dealershipclient.Emails.EmailTable.EmailRow')).toHaveLength(1)
  })

  it('При клике на строку вызывается changeStartPage и navigate на заявку', () => {
    render(<EmailTable emails={mockedPreparedEmails.emails} isLoading={false} isFetched={true} />, {
      wrapper: createWrapper,
    })
    userEvent.click(screen.getByTestId('dealershipclient.Emails.EmailTable.EmailRow'))
    expect(mockedNavigate).toHaveBeenCalledWith(appRoutes.detailedEmail('1'))
  })

  it('Отображается пагинация', () => {
    render(<EmailTable emails={mockedPreparedEmails.emails} isLoading={false} isFetched={true} />, {
      wrapper: createWrapper,
    })
    expect(screen.getByTestId('dealershipclient.Emails.EmailTable.TablePagination')).toBeInTheDocument()
  })
})
