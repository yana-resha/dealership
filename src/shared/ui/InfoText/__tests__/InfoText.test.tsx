import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { InfoText } from '../InfoText'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('InfoTextTest', () => {
  describe('Отображаются все элементы', () => {
    it('Отображается Label', () => {
      render(<InfoText label="Label">Information</InfoText>, { wrapper: createWrapper })

      expect(screen.getByText('Label'))
    })

    it('Отображается Информация', () => {
      render(<InfoText label="Label">Information</InfoText>, { wrapper: createWrapper })

      expect(screen.getByText('Information'))
    })
  })
})
