import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { OrderCalculator } from '../OrderCalculator'
import { formFields } from './OrderCalculator.mock'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

disableConsole('error')

describe('OrderCalculator', () => {
  const fn = jest.fn()

  describe('Форма отображается корректно', () => {
    beforeEach(() => {
      render(<OrderCalculator isOfferLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
    })

    it('Основные поля присутствуют на форме', () => {
      for (const fieldName of formFields) {
        switch (fieldName) {
          case 'Стоимость':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(4)
            break
          case 'Тип продукта':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(2)
            break
          default:
            expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
            break
        }
      }
    })
  })

  describe('Валидация формы работает корректно', () => {
    beforeEach(() => {
      render(<OrderCalculator isOfferLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByText('Показать'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(4)
    })
  })

  describe('Дополнительные поля', () => {
    beforeEach(() => {
      render(<OrderCalculator isOfferLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
    })

    it('Item добавляется и удаляется, но не последний', () => {
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
      const addingSquareBtn = screen.getAllByTestId('addingSquareBtn')[0]
      userEvent.click(addingSquareBtn)
      userEvent.click(addingSquareBtn)
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(5)

      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
    })
  })
})
