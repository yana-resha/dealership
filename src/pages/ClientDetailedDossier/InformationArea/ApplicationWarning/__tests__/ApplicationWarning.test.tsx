import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { ApplicationWarning } from '../ApplicationWarning'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ApplicationWarning', () => {
  it('Отображается предупреждение о Устаревании данных', () => {
    render(<ApplicationWarning statusCode={StatusCode.NEED_REFORMATION} />, { wrapper: createWrapper })
    expect(
      screen.getByText(
        'Данные индивидуальных условий кредитования могли устареть. Требуется переформировать печатные формы.',
      ),
    ).toBeInTheDocument()
  })

  it('Отображается предупреждение об Актуализации данных', () => {
    render(<ApplicationWarning statusCode={StatusCode.CLIENT_REJECTED} />, { wrapper: createWrapper })
    expect(
      screen.getByText('Клиенту необходимо обратиться в отделение банка для актуализации данных.'),
    ).toBeInTheDocument()
  })
})
