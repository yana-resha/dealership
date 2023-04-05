import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik, useFormikContext } from 'formik'
import * as mockFormik from 'formik'
import { MockStore } from 'redux-mock-store'
import * as Yup from 'yup'

import { StoreProviderMock, ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { SwitchInput } from '../SwitchInput'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

let validationSchema = Yup.object().shape({})

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>
      <Formik initialValues={{ testSwitchName: 0 }} validationSchema={validationSchema} onSubmit={() => {}}>
        <Form>
          {children}
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('SwitchInputTest', () => {
  describe('SwitchInput отображается корректно', () => {
    beforeEach(() => {
      render(<SwitchInput name="testSwitchName" label="Тестовый switch" />, {
        wrapper: createWrapper,
      })
    })

    it('Label для SwitchInput отображается', () => {
      expect(screen.getByText('Тестовый switch')).toBeInTheDocument()
    })
  })

  describe('SwitchInput обновляет значение формы', () => {
    const mockedSetFieldValue = jest.fn()

    beforeEach(() => {
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: mockedSetFieldValue,
          } as any),
      )
      render(<SwitchInput name="testSwitchName" label="Тестовый switch" />, {
        wrapper: createWrapper,
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('При клике по SwitchInput вызывается setFieldValue', () => {
      userEvent.click(screen.getByText('Тестовый switch'))
      expect(mockedSetFieldValue).toBeCalledTimes(1)
    })
  })

  describe('SwitchInput валидируется', () => {
    beforeEach(() => {
      validationSchema = Yup.object().shape({
        testSwitchName: Yup.number().min(1, 'Необходимо подтверждение'),
      })
      render(<SwitchInput name="testSwitchName" label="Тестовый switch" />, {
        wrapper: createWrapper,
      })
    })

    it('Отображается сообщение об ошибке, если поле обязательное', async () => {
      userEvent.click(screen.getByText('Submit'))
      expect(await screen.findByText('Необходимо подтверждение')).toBeInTheDocument()
    })
  })
})
