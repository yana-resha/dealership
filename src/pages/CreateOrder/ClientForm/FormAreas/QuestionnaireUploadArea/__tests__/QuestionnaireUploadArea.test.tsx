import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import { QueryClient, QueryClientProvider } from 'react-query'

import { SubmitAction } from 'pages/CreateOrder/ClientForm/ClientForm.types'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { clientFormValidationSchema } from '../../../config/clientFormValidation'
import { QuestionnaireUploadArea } from '../QuestionnaireUploadArea'

const mockedQuestionnaireUploadFields = {
  questionnaireFile: null,
  submitAction: SubmitAction.Save,
}

const queryClient = new QueryClient()
const createWrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProviderMock>
      <Formik
        initialValues={mockedQuestionnaireUploadFields}
        validationSchema={clientFormValidationSchema}
        onSubmit={() => {}}
      >
        <Form>
          {children}
          <Button type="submit" data-testid="submit" />
        </Form>
      </Formik>
    </ThemeProviderMock>
  </QueryClientProvider>
)
disableConsole('error')

describe('QuestionnaireUploadAreaTest', () => {
  describe('Все элементы отображаются на форме', () => {
    beforeEach(() => {
      render(
        <QuestionnaireUploadArea
          isDifferentVendor={false}
          isReuploadedQuestionnaire={false}
          setReuploadedQuestionnaire={jest.fn()}
          isAllowedUploadQuestionnaire={true}
          onUploadDocument={jest.fn()}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Заголовок блока присутствует на форме', () => {
      expect(screen.getByText('Подписанная анкета')).toBeInTheDocument()
    })

    it('Инструкция по загрузке анкеты присутствует на форме', () => {
      expect(screen.getByText(/Загрузите или перетащите сюда анкету/)).toBeInTheDocument()
    })

    it('Кнопка для загрузки анкеты присутствует на форме', () => {
      expect(screen.getByText('Загрузить анкету')).toBeInTheDocument()
    })
  })

  describe('Все поля валидируется', () => {
    beforeEach(() => {
      render(
        <QuestionnaireUploadArea
          isDifferentVendor={false}
          isReuploadedQuestionnaire={false}
          setReuploadedQuestionnaire={jest.fn()}
          isAllowedUploadQuestionnaire={true}
          onUploadDocument={jest.fn()}
        />,
        {
          wrapper: createWrapper,
        },
      )
      userEvent.click(screen.getByTestId('submit'))
    })

    it('Загрузка анкеты валидируется', async () => {
      expect(await screen.findByText('Необходимо загрузить анкету')).toBeInTheDocument()
    })
  })
})
