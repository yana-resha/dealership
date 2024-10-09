import { PropsWithChildren } from 'react'

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
  submitAction: SubmitAction.SAVE,
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
          isSaveDraftDisabled={false}
          onClickFormBtn={jest.fn()}
          isDisabledFormBtn={true}
          isFormLoading={true}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Заголовок блока присутствует на форме', () => {
      expect(screen.getByText('Анкета клиента')).toBeInTheDocument()
    })

    it('Инструкция по загрузке анкеты присутствует на форме', () => {
      expect(screen.getByText('Загрузите анкету клиента в формате pdf и не более 15 мб.')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Если у Вас нет универсальной анкеты, Вы можете сформировать анкету по форме банка.',
        ),
      ).toBeInTheDocument()
    })

    it('Кнопка для загрузки анкеты присутствует на форме', () => {
      expect(screen.getByText('Загрузить анкету')).toBeInTheDocument()
    })

    it('Если isSaveDraftDisabled = false, кнопка для формирования анкеты присутствует в форме', async () => {
      expect(screen.queryByText('Сформировать анкету')).toBeInTheDocument()
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
          isSaveDraftDisabled={true}
          onClickFormBtn={jest.fn()}
          isDisabledFormBtn={true}
          isFormLoading={false}
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

  describe('Отображение кнопки Сформировать анкету', () => {
    it('Если isSaveDraftDisabled = true, кнопка для формирования анкеты отсутствует в форме', () => {
      render(
        <QuestionnaireUploadArea
          isDifferentVendor={false}
          isReuploadedQuestionnaire={false}
          setReuploadedQuestionnaire={jest.fn()}
          isAllowedUploadQuestionnaire={true}
          onUploadDocument={jest.fn()}
          isSaveDraftDisabled={true}
          onClickFormBtn={jest.fn()}
          isDisabledFormBtn={false}
          isFormLoading={false}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(screen.queryByText('Сформировать анкету')).not.toBeInTheDocument()
    })

    it('Если isFormLoading = true, отображается лоадер', () => {
      render(
        <QuestionnaireUploadArea
          isDifferentVendor={false}
          isReuploadedQuestionnaire={false}
          setReuploadedQuestionnaire={jest.fn()}
          isAllowedUploadQuestionnaire={true}
          onUploadDocument={jest.fn()}
          isSaveDraftDisabled={false}
          onClickFormBtn={jest.fn()}
          isDisabledFormBtn={false}
          isFormLoading={true}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(screen.getByTestId('circularProgressWheel')).toBeInTheDocument()
    })
  })
})
