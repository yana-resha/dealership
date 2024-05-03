import { PropsWithChildren } from 'react'

import { Vendor } from '@sberauto/dictionarydc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MockStore } from 'redux-mock-store'

import { ThemeProviderMock, StoreProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { ChoosePoint } from '../ChoosePoint'
import * as ChoosePointApi from '../ChoosePoint.api'
import * as ChoosePointUtils from '../ChoosePoint.utils'

const mockResponse: Vendor[] = [
  {
    vendorCode: '2002852',
    vendorName: 'Сармат',
    address: 'Ханты-Мансийск Зябликова 4',
  },
  {
    vendorCode: '4003390',
    vendorName: 'ХимкиАвто',
    address: 'Саратов Симонова 2',
  },
  {
    vendorCode: '3444920',
    vendorName: 'СайгакФорд',
    address: 'Москва Курдюка 4',
  },
]

const mockedUseGetVendorsListQuery: jest.SpyInstance = jest.spyOn(ChoosePointApi, 'useGetVendorsListQuery')
const mockedSavePointOfSaleToCookies: jest.SpyInstance = jest.spyOn(
  ChoosePointUtils,
  'savePointOfSaleToCookies',
)
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const queryClient = new QueryClient()
const createWrapper = ({ store, children }: WrapperProps) => (
  <QueryClientProvider client={queryClient}>
    <StoreProviderMock mockStore={store}>
      <ThemeProviderMock>{children}</ThemeProviderMock>
    </StoreProviderMock>
  </QueryClientProvider>
)

disableConsole('error')

describe('ChoosePoint', () => {
  describe('Все элементы отображаются', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Отображается Автокомплит', () => {
      expect(screen.getByPlaceholderText('ТТ или адрес')).toBeInTheDocument()
    })

    it('Отображается кнопка Продолжить', () => {
      expect(screen.getByTestId('choosePointBtn')).toBeInTheDocument()
    })
  })

  describe('Если передан пропс isHeader, меняется размер и отсутствуеткнопка', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint isHeader />, { wrapper: createWrapper })
    })

    it('Отображается Автокомплит', () => {
      expect(screen.getByPlaceholderText('ТТ или адрес')).toBeVisible()
      expect(screen.getByPlaceholderText('ТТ или адрес')).toHaveClass('MuiInputBase-inputSizeSmall')
    })

    it('Отображается кнопка иконка', () => {
      expect(screen.queryByTestId('choosePointBtn')).not.toBeInTheDocument()
    })

    it('Список опций открыт по умолчанию', async () => {
      const options = await screen.findAllByRole('option')
      expect(options).toHaveLength(3)
    })
  })

  describe('Ожидание загрузки автосалонов обрабатывается', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: undefined,
        error: undefined,
        isLoading: true,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Выпадающий список содержит слово "Загрузка..."', () => {
      userEvent.click(screen.getByPlaceholderText(/ТТ или адрес/i))
      expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument()
    })

    it('Отображается индиктор загрузки', () => {
      expect(screen.getByTestId('circularProgressWheel')).toBeInTheDocument()
    })
  })

  describe('Список автосалонов успешно подгружается в Автокомплит', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Все элементы отображаются в выпадающем списке', async () => {
      userEvent.click(screen.getByPlaceholderText('ТТ или адрес'))
      expect(await screen.findAllByRole('option')).toHaveLength(3)
    })

    it('Записи отображаются в корректном формате', async () => {
      userEvent.click(screen.getByPlaceholderText('ТТ или адрес'))
      const options = await screen.findAllByRole('option')
      expect(options[0]).toHaveTextContent('Сармат 2002852 Ханты-Мансийск Зябликова 4')
      expect(options[1]).toHaveTextContent('ХимкиАвто 4003390 Саратов Симонова 2')
      expect(options[2]).toHaveTextContent('СайгакФорд 3444920 Москва Курдюка 4')
    })
  })

  describe('Взаимодействие со списком салонов выполняется корректно', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Сортировка списка выполняется корректно', async () => {
      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Са')
      const options = await screen.findAllByRole('option')
      expect(options[0]).toHaveTextContent('Сармат 2002852 Ханты-Мансийск Зябликова 4')
      expect(options[1]).toHaveTextContent('СайгакФорд 3444920 Москва Курдюка 4')
      expect(options[2]).toHaveTextContent('ХимкиАвто 4003390 Саратов Симонова 2')
    })

    it('Фильтрация выполняется корректно', async () => {
      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Сар')
      const options = await screen.findAllByRole('option')
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveTextContent('Сармат 2002852 Ханты-Мансийск Зябликова 4')
      expect(options[1]).toHaveTextContent('ХимкиАвто 4003390 Саратов Симонова 2')
      userEvent.type(textField, 'мат')
      const option = await screen.findByRole('option')
      expect(option).toHaveTextContent('Сармат 2002852 Ханты-Мансийск Зябликова 4')
    })

    it('Выбор автосалона выполняется корректно', async () => {
      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Химки')
      const option = await screen.findByRole('option')
      userEvent.click(option)
      expect(textField).toHaveValue('ХимкиАвто 4003390 Саратов Симонова 2')
    })
  })

  describe('При выборе ДЦ видим корректную модалку', () => {
    beforeEach(() => {
      // mockedUseGetVendorsListQuery.mockImplementation(() => ({
      //   data: mockResponse,
      //   error: undefined,
      //   isLoading: false,
      // }))
      // render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Модальное окно отображается корректно, есть информация о выбранной точке (после нажатии на кнопку Продолжить)', async () => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })

      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Сармат')
      const option = await screen.findByRole('option')
      expect(option).not.toBeNull()
      userEvent.click(option)
      userEvent.click(screen.getByText('Продолжить'))
      expect(screen.getByText('Вы выбрали точку:')).toBeVisible()
      expect(screen.getByText('Сармат 2002852 Ханты-Мансийск Зябликова 4')).toBeVisible()
      expect(screen.getByText('Все верно?')).toBeVisible()
      screen.getAllByRole('button').map((el, i) => {
        expect(el).toHaveTextContent(i === 0 ? 'close.svg' : i === 1 ? 'Да' : 'Нет')
      })
    })
    it('В хедере модальное окно отображается сразу после выбора ДЦ', async () => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint isHeader />, { wrapper: createWrapper })

      const options = await screen.findAllByRole('option')
      userEvent.click(options[0])
      expect(screen.getByTestId('choosePointModal')).toBeInTheDocument()
    })
  })

  describe('Сохранение выбранной точки в Cookies выполняется корректно', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Вызывается функция сохранения в Cookies', async () => {
      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Химки')
      const option = await screen.findByRole('option')
      expect(option).not.toBeNull()
      userEvent.click(option)
      userEvent.click(screen.getByText('Продолжить'))
      userEvent.click(screen.getByText('Да'))
      expect(mockedSavePointOfSaleToCookies).toBeCalledTimes(1)
    })
  })

  describe('Если передана функция успешного завершения, она вызывается', () => {
    const successFn = jest.fn()

    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint onSuccessEditing={successFn} />, { wrapper: createWrapper })
    })

    it('Вызывается функция успешного завершения', async () => {
      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Химки')
      const option = await screen.findByRole('option')
      expect(option).not.toBeNull()
      userEvent.click(option)
      userEvent.click(screen.getByText('Продолжить'))
      userEvent.click(screen.getByText('Да'))
      expect(successFn).toBeCalledTimes(1)
    })
  })

  describe('Сохранение выбранной точки не выполняется, если нажали "Нет" в модальном окне', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Не вызывается функция сохранения в Cookies, происходит очистка автокомплита', async () => {
      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Химки')
      const option = await screen.findByRole('option')
      expect(option).not.toBeNull()
      userEvent.click(option)
      userEvent.click(screen.getByText('Продолжить'))
      userEvent.click(screen.getByText('Нет'))
      expect(mockedSavePointOfSaleToCookies).toBeCalledTimes(0)
      expect(screen.getByPlaceholderText('ТТ или адрес')).toHaveTextContent('')
    })
  })

  describe('Сохранение точки не выполняется, если она не была выбрана', () => {
    beforeEach(() => {
      mockedUseGetVendorsListQuery.mockImplementation(() => ({
        data: mockResponse,
        error: undefined,
        isLoading: false,
      }))
      render(<ChoosePoint />, { wrapper: createWrapper })
    })

    it('Выводится сообщение об ошибке', () => {
      userEvent.click(screen.getByText('Продолжить'))
      expect(screen.getByText('Необходимо выбрать автосалон'))
    })

    it('Функция сохранения в Cookies не вызывается', () => {
      userEvent.click(screen.getByText('Продолжить'))
      expect(mockedSavePointOfSaleToCookies).toBeCalledTimes(0)
    })
  })
})
