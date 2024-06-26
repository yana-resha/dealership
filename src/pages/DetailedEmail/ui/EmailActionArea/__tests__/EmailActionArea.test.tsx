import { PropsWithChildren } from 'react'

import { EmailStatusCode } from '@sberauto/emailappdc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockProviders } from 'tests/mocks'

import { EmailActionArea } from '../EmailActionArea'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

const mockedNavigate = jest.fn()
const mockedEnqueueSnackbar = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockedEnqueueSnackbar,
  }),
}))

describe('EmailActionArea', () => {
  it('Если status=INITIAL, то отображается кнопка Создать заявку', () => {
    render(<EmailActionArea status={EmailStatusCode.INITIAL} targetApplicationId="11" emailId={1} />, {
      wrapper: createWrapper,
    })
    const btn = screen.getByText('Создать заявку')
    expect(btn).toBeInTheDocument()
    userEvent.click(btn)
    expect(mockedNavigate).toHaveBeenCalledWith('/create_order', { state: { emailId: 1 } })
  })

  it('Если status=PROCESSED, то отображается кнопка Перейти в заявку', () => {
    render(<EmailActionArea status={EmailStatusCode.PROCESSED} targetApplicationId="11" emailId={1} />, {
      wrapper: createWrapper,
    })
    const btn = screen.getByText('Перейти в заявку')
    expect(btn).toBeInTheDocument()
    userEvent.click(btn)
    expect(mockedNavigate).toHaveBeenCalledWith('/order_list/11')
  })

  it('Если status=ANSWERED, то отображается кнопка Перейти в заявку', () => {
    render(<EmailActionArea status={EmailStatusCode.ANSWERED} targetApplicationId="11" emailId={1} />, {
      wrapper: createWrapper,
    })
    const btn = screen.getByText('Перейти в заявку')
    expect(btn).toBeInTheDocument()
    userEvent.click(btn)
    expect(mockedNavigate).toHaveBeenCalledWith('/order_list/11')
  })

  it('Если status=(PROCESSED | ANSWERED), но нет targetApplicationId, то отображается ошибка вместо перехода на заявку', async () => {
    render(
      <EmailActionArea status={EmailStatusCode.ANSWERED} targetApplicationId={undefined} emailId={1} />,
      {
        wrapper: createWrapper,
      },
    )
    const btn = screen.getByText('Перейти в заявку')
    expect(btn).toBeInTheDocument()
    userEvent.click(btn)
    expect(mockedEnqueueSnackbar).toHaveBeenCalledWith('Данные о заявке не найдены', { variant: 'error' })
  })
})
