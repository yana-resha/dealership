import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { ProgressBar } from '../ProgressBar'

const steps = ['Первый этап', 'Второй этап', 'Третий этап', 'Четвертый этап']
const STATUS_CURRENT = 'progressStatusCurrent'
const STATUS_PASSED = 'progressStatusPassed'
const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ProgressBarTest', () => {
  describe('Отображаются все элементы', () => {
    it('Отображаются все этапы', () => {
      render(<ProgressBar steps={steps} currentStep={0} />, { wrapper: createWrapper })

      expect(screen.getAllByTestId('progressStep')).toHaveLength(4)
      expect(screen.getByText('Первый этап')).toBeInTheDocument()
      expect(screen.getByText('Второй этап')).toBeInTheDocument()
      expect(screen.getByText('Третий этап')).toBeInTheDocument()
      expect(screen.getByText('Четвертый этап')).toBeInTheDocument()
    })
  })

  describe('ProgressBar отображает выбранный этап', () => {
    it('ProgressBar отображает первый этап', () => {
      render(<ProgressBar steps={steps} currentStep={0} />, { wrapper: createWrapper })

      const progressSteps = screen.getAllByTestId('progressStep')
      expect(progressSteps[0].className.includes(STATUS_CURRENT)).toBe(true)
      expect(progressSteps[0].className.includes(STATUS_PASSED)).toBe(false)
      expect(progressSteps[1].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[1].className.includes(STATUS_PASSED)).toBe(false)
      expect(progressSteps[2].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[2].className.includes(STATUS_PASSED)).toBe(false)
      expect(progressSteps[3].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[3].className.includes(STATUS_PASSED)).toBe(false)
    })

    it('ProgressBar отображает второй этап', () => {
      render(<ProgressBar steps={steps} currentStep={1} />, { wrapper: createWrapper })

      const progressSteps = screen.getAllByTestId('progressStep')
      expect(progressSteps[0].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[0].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[1].className.includes(STATUS_CURRENT)).toBe(true)
      expect(progressSteps[1].className.includes(STATUS_PASSED)).toBe(false)
      expect(progressSteps[2].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[2].className.includes(STATUS_PASSED)).toBe(false)
      expect(progressSteps[3].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[3].className.includes(STATUS_PASSED)).toBe(false)
    })

    it('ProgressBar отображает третий этап', () => {
      render(<ProgressBar steps={steps} currentStep={2} />, { wrapper: createWrapper })

      const progressSteps = screen.getAllByTestId('progressStep')
      expect(progressSteps[0].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[0].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[1].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[1].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[2].className.includes(STATUS_CURRENT)).toBe(true)
      expect(progressSteps[2].className.includes(STATUS_PASSED)).toBe(false)
      expect(progressSteps[3].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[3].className.includes(STATUS_PASSED)).toBe(false)
    })

    it('ProgressBar отображает четвертый этап', () => {
      render(<ProgressBar steps={steps} currentStep={3} />, { wrapper: createWrapper })

      const progressSteps = screen.getAllByTestId('progressStep')
      expect(progressSteps[0].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[0].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[1].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[1].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[2].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[2].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[3].className.includes(STATUS_CURRENT)).toBe(true)
      expect(progressSteps[3].className.includes(STATUS_PASSED)).toBe(false)
    })

    it('Все этапы ProgressBar пройдены', () => {
      render(<ProgressBar steps={steps} currentStep={4} />, { wrapper: createWrapper })

      const progressSteps = screen.getAllByTestId('progressStep')
      expect(progressSteps[0].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[0].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[1].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[1].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[2].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[2].className.includes(STATUS_PASSED)).toBe(true)
      expect(progressSteps[3].className.includes(STATUS_CURRENT)).toBe(false)
      expect(progressSteps[3].className.includes(STATUS_PASSED)).toBe(true)
    })
  })
})
