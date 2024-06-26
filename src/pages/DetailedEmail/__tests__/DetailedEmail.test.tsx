import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { mockedPreparedEmails } from 'entities/email/hooks/__tests__/useGetEmailsQuery.mock'
import * as useGetEmailsQueryModule from 'entities/email/hooks/useGetEmailsQuery'
import { MockProviders } from 'tests/mocks'

import { DetailedEmail } from '../DetailedEmail'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

jest.mock('pages/DetailedEmail/ui/EmailActionArea/EmailActionArea.tsx')

const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useParams: () => ({ emailId: '1' }),
}))
jest.mock('entities/pointOfSale/utils/getPointOfSaleFromCookies.ts', () => ({
  getPointOfSaleFromCookies: () => ({
    vendorCode: '1',
  }),
}))
jest.mock('shared/hooks/store/useAppSelector', () => ({
  useAppSelector: () => ({}),
}))

const mockedUseGetEmailsQuery = jest.spyOn(useGetEmailsQueryModule, 'useGetEmailsQuery')

describe('DetailedEmail', () => {
  it('Если isLoading=true, то отображается индикатор загрузки', () => {
    mockedUseGetEmailsQuery.mockImplementation(
      () => ({ data: mockedPreparedEmails, isLoading: true, isError: false } as any),
    )
    render(<DetailedEmail />, {
      wrapper: createWrapper,
    })
    expect(screen.queryByTestId('circularProgressWheel')).toBeInTheDocument()
    expect(screen.queryByText('Ошибка. Не удалось получить данные о письме')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dealershipclient.DetailedEmail.EmailContainer')).not.toBeInTheDocument()
  })

  it('Если isError=true, то отображается ошибка с возможностью вернуться назад', () => {
    mockedUseGetEmailsQuery.mockImplementation(
      () => ({ data: mockedPreparedEmails, isLoading: false, isError: true } as any),
    )
    render(<DetailedEmail />, {
      wrapper: createWrapper,
    })
    expect(screen.queryByTestId('circularProgressWheel')).not.toBeInTheDocument()
    expect(screen.queryByText('Ошибка. Не удалось получить данные о письме')).toBeInTheDocument()
    expect(screen.queryByTestId('dealershipclient.DetailedEmail.EmailContainer')).not.toBeInTheDocument()

    const onBackButton = screen.getByTestId('dealershipclient.DetailedEmail.BackButton')
    userEvent.click(onBackButton)
    expect(mockedNavigate).toHaveBeenCalledWith('/email_list')
  })

  it('Если isError=false, но данных нет, то отображается ошибка с возможностью вернуться назад', () => {
    mockedUseGetEmailsQuery.mockImplementation(
      () => ({ data: { ...mockedPreparedEmails, emailsMap: {} }, isLoading: false, isError: false } as any),
    )
    render(<DetailedEmail />, {
      wrapper: createWrapper,
    })
    expect(screen.queryByTestId('circularProgressWheel')).not.toBeInTheDocument()
    expect(screen.queryByText('Ошибка. Не удалось получить данные о письме')).toBeInTheDocument()
    expect(screen.queryByTestId('dealershipclient.DetailedEmail.EmailContainer')).not.toBeInTheDocument()

    const onBackButton = screen.getByTestId('dealershipclient.DetailedEmail.BackButton')
    userEvent.click(onBackButton)
    expect(mockedNavigate).toHaveBeenCalledWith('/email_list')
  })

  it('Если есть данные , и isLoading=false, isError=true, то отображаются переданные данные', () => {
    mockedUseGetEmailsQuery.mockImplementation(
      () => ({ data: mockedPreparedEmails, isLoading: false, isError: false } as any),
    )
    render(<DetailedEmail />, {
      wrapper: createWrapper,
    })
    expect(screen.queryByTestId('circularProgressWheel')).not.toBeInTheDocument()
    expect(screen.queryByText('Ошибка. Не удалось получить данные о письме')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dealershipclient.DetailedEmail.EmailContainer')).toBeInTheDocument()

    expect(screen.queryByText(mockedPreparedEmails.emailsMap[1]?.topic || '')).toBeInTheDocument()
    expect(screen.queryByText(mockedPreparedEmails.emailsMap[1]?.from || '')).toBeInTheDocument()
    expect(screen.queryByText('14.06.2024 09:51')).toBeInTheDocument()
    expect(screen.queryByText(mockedPreparedEmails.emailsMap[1]?.body || '')).toBeInTheDocument()
    expect(
      screen.queryByText(mockedPreparedEmails.emailsMap[1]?.attachedFiles?.[0]?.fileName || ''),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(mockedPreparedEmails.emailsMap[1]?.attachedFiles?.[1]?.fileName || ''),
    ).toBeInTheDocument()

    expect(screen.queryByTestId('dealershipclient.DetailedEmail.EmailActionArea')).toBeInTheDocument()
  })
})
