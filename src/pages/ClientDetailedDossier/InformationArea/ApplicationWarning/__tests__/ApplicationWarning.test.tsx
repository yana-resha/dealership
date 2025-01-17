import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { ApplicationWarning } from '../ApplicationWarning'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ApplicationWarning', () => {
  it('Отображается предупреждение о Устаревании данных', () => {
    render(
      <ApplicationWarning
        statusCode={StatusCode.NEED_REFORMATION}
        errorDescription={undefined}
        isGovProgramDocumentsNecessaryRequest={false}
        isGovProgramDocumentsPending={false}
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(
      screen.getByText(
        'Данные индивидуальных условий кредитования могли устареть. Требуется переформировать печатные формы.',
      ),
    ).toBeInTheDocument()
  })

  it('Если есть errorDescription, он отображается', () => {
    render(
      <ApplicationWarning
        statusCode={StatusCode.CLIENT_REJECTED}
        errorDescription="errorDescription"
        isGovProgramDocumentsNecessaryRequest={false}
        isGovProgramDocumentsPending={false}
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.getByText('errorDescription')).toBeInTheDocument()
  })

  it('Если нет errorDescription, он не отображается', () => {
    render(
      <ApplicationWarning
        statusCode={StatusCode.CLIENT_REJECTED}
        errorDescription={undefined}
        isGovProgramDocumentsNecessaryRequest={false}
        isGovProgramDocumentsPending={false}
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.queryByText('errorDescription')).not.toBeInTheDocument()
  })
})
