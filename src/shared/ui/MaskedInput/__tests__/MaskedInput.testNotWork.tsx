import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'
import { MockStore } from 'redux-mock-store'
import * as Yup from 'yup'

import { maskPhoneNumber } from 'shared/masks/InputMasks'
import { StoreProviderMock, ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { MaskedInput } from '../MaskedInput'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

let validationSchema = Yup.object().shape({})

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>
      <Formik
        initialValues={{ testMaskedInputName: '' }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        <Form>
          {children}
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('MaskedInputTest', () => {
  describe('MaskedInput отображается корректно', () => {
    beforeEach(() => {
      render(
        <MaskedInput
          name="testMaskedInputName"
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Label для MaskedInput отображается', () => {
      expect(screen.getByText('Тестовое поле с маской')).toBeInTheDocument()
    })

    it('Placeholder в MaskedInput отображается', () => {
      expect(screen.getByPlaceholderText('Тестовый плейсхолдер')).toBeInTheDocument()
    })
  })

  describe('MaskedInput работает корректно', () => {
    beforeEach(() => {
      render(
        <MaskedInput
          name="testMaskedInputName"
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Текст не вводится, если он не соответствует маске', () => {
      userEvent.type(screen.getByRole('textbox'), 'qwerty')
      expect(screen.getByRole('textbox')).toHaveValue('')
    })

    it('Текст вводится, если он соответствует маске', () => {
      userEvent.type(screen.getByRole('textbox'), '001234567')
      expect(screen.getByRole('textbox')).toHaveValue('8-900-123-45-67')
    })
  })

  describe('MaskedInput обновляет значение формы', () => {
    const mockedSetFieldValue = jest.fn()

    beforeEach(() => {
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: mockedSetFieldValue,
          } as any),
      )
      render(
        <MaskedInput
          name="testMaskedInputName"
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('При вводе текста в MaskedInput вызывается setFieldValue', () => {
      userEvent.type(screen.getByRole('textbox'), '001234567')
      expect(mockedSetFieldValue).toBeCalledTimes(9)
    })
  })

  describe('MaskedInput валидируется', () => {
    beforeEach(() => {
      validationSchema = Yup.object().shape({
        testMaskedInputName: Yup.string().required('Поле обязательно для заполнения'),
      })
      render(
        <MaskedInput
          name="testMaskedInputName"
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Отображается сообщение об ошибке, если поле обязательное', async () => {
      userEvent.click(screen.getByText('Submit'))
      expect(await screen.findByText('Поле обязательно для заполнения')).toBeInTheDocument()
    })
  })
})
