import React, { PropsWithChildren } from 'react'
import { ThemeProviderMock, StoreProviderMock } from 'tests/mocks'
import { MockStore } from 'redux-mock-store'
import { disableConsole } from 'tests/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as PoSApi from 'shared/api/pointsOfSale.api'
import * as PoSUtil from 'common/auth/PointOfSaleAuth/pointsOfSale.utils'
import * as Router from 'react-router-dom'
import { useGetVendorListQuery } from 'shared/api/pointsOfSale.api'
import { PointOfSaleAuth } from '../PointOfSaleAuth'

const mockedUseGetVendorListQuery: jest.SpyInstance = jest.spyOn(PoSApi, 'useGetVendorListQuery')
const mockedSavePointOfSaleToCookies: jest.SpyInstance = jest.spyOn(PoSUtil, 'savePointOfSaleToCookies')
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>{children}</ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('PointOfSaleAuthTest', () => {
  describe('Все элементы отображаются на форме', () => {
    beforeEach(() => {
      mockedUseGetVendorListQuery.mockImplementation(() => ({
        data: mockResponse(),
        error: undefined,
        isLoading: false,
      }))
      render(<PointOfSaleAuth />, { wrapper: createWrapper })
    })

    it('Отображается кнопка назад', () => {
      expect(screen.getByTestId('backButton')).toBeInTheDocument()
    })

    it('Отображается аватарка', () => {
      expect(screen.getByTestId('avatar')).toBeInTheDocument()
    })

    it('Отображается текст "Выберите автосалон"', () => {
      expect(screen.getByText('Выберите автосалон')).toBeInTheDocument()
    })

    it('Отображается Автокомплит', () => {
      expect(screen.getByPlaceholderText('ТТ или адрес')).toBeInTheDocument()
    })

    it('Отображается кнопка Войти', () => {
      expect(screen.getByText('Войти')).toBeInTheDocument()
    })
  })

  describe('Ожидание загрузки автосалонов обрабатывается', () => {
    beforeEach(() => {
      mockedUseGetVendorListQuery.mockImplementation(() => ({
        data: undefined,
        error: undefined,
        isLoading: true,
      }))
      render(<PointOfSaleAuth />, { wrapper: createWrapper })
    })

    it('Выпадающий список содержит слово "Загрузка..."', () => {
      userEvent.click(screen.getByPlaceholderText(/ТТ или адрес/i))
      expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument()
    })

    it('Отображается индиктор загрузки', () => {
      expect(screen.getByTestId('loadingImg')).toBeInTheDocument()
    })
  })

  describe('Список автосалонов успешно подгружается в Автокомплит', () => {
    beforeEach(() => {
      mockedUseGetVendorListQuery.mockImplementation(() => ({
        data: undefined,
        error: mockResponse(),
        isLoading: false,
      }))
      render(<PointOfSaleAuth />, { wrapper: createWrapper })
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
      mockedUseGetVendorListQuery.mockImplementation(() => ({
        data: undefined,
        error: mockResponse(),
        isLoading: false,
      }))
      render(<PointOfSaleAuth />, { wrapper: createWrapper })
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

  describe('Сохранение выбранной точки в Cookies выполняется корректно', () => {
    beforeEach(() => {
      mockedUseGetVendorListQuery.mockImplementation(() => ({
        data: undefined,
        error: mockResponse(),
        isLoading: false,
      }))
      render(<PointOfSaleAuth />, { wrapper: createWrapper })
    })

    it('Вызывается функция сохранения в Cookies', async () => {
      const textField = screen.getByPlaceholderText('ТТ или адрес')
      userEvent.click(textField)
      userEvent.type(textField, 'Химки')
      const option = await screen.findByRole('option')
      expect(option).not.toBeNull()
      userEvent.click(option)
      userEvent.click(screen.getByText('Войти'))
      expect(mockedSavePointOfSaleToCookies).toBeCalledTimes(1)
    })
  })

  describe('Сохранение точки не выполняется, если она не была выбрана', () => {
    beforeEach(() => {
      mockedUseGetVendorListQuery.mockImplementation(() => ({
        data: undefined,
        error: mockResponse(),
        isLoading: false,
      }))
      render(<PointOfSaleAuth />, { wrapper: createWrapper })
    })

    it('Выводится сообщение об ошибке', () => {
      userEvent.click(screen.getByText('Войти'))
      expect(screen.getByText('Необходимо выбрать автосалон'))
    })

    it('Функция сохранения в Cookies не вызывается', () => {
      userEvent.click(screen.getByText('Войти'))
      expect(mockedSavePointOfSaleToCookies).toBeCalledTimes(0)
    })
  })
})

function mockResponse() {
  return JSON.parse(
    '[\n' +
      '         {\n' +
      '            "vendorCode":"2002852",\n' +
      '            "vendorName":"Сармат",\n' +
      '            "cityName":"Ханты-Мансийск",\n' +
      '            "houseNumber":"4",\n' +
      '            "streetName":"Зябликова"\n' +
      '         },\n' +
      '         {\n' +
      '            "vendorCode":"4003390",\n' +
      '            "vendorName":"ХимкиАвто",\n' +
      '            "cityName":"Саратов",\n' +
      '            "houseNumber":"2",\n' +
      '            "streetName":"Симонова"\n' +
      '         },\n' +
      '         {\n' +
      '            "vendorCode":"3444920",\n' +
      '            "vendorName":"СайгакФорд",\n' +
      '            "cityName":"Москва",\n' +
      '            "houseNumber":"4",\n' +
      '            "streetName":"Курдюка"\n' +
      '         }\n' +
      '      ]',
  )
}
