import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'

import { StatusFilter } from '../StatusFilter'

describe('StatusFilter', () => {
  it('Отрисовывается компонент', () => {
    const change = jest.fn()

    render(
      <ThemeProviderMock>
        <StatusFilter onChange={change} />
      </ThemeProviderMock>,
    )

    expect(screen.getByText('Черновик')).toBeVisible()
    expect(screen.getByText('Актуальные заявки')).toBeVisible()
    expect(screen.getByText('Ожидает решение')).toBeVisible()
    expect(screen.getByText('КД Отменен')).toBeVisible()
    expect(screen.getByText('Ожидание финансирования')).toBeVisible()
    expect(screen.getByText('Кредит одобрен')).toBeVisible()
    expect(screen.getByText('Отказ')).toBeVisible()
  })
  it('При клике на любую из кнопок вызывается onChange', () => {
    const change = jest.fn()

    render(
      <ThemeProviderMock>
        <StatusFilter onChange={change} />
      </ThemeProviderMock>,
    )

    userEvent.click(screen.getByText('Черновик'))
    userEvent.click(screen.getByText('Актуальные заявки'))
    userEvent.click(screen.getByText('Ожидает решение'))
    userEvent.click(screen.getByText('КД Отменен'))
    userEvent.click(screen.getByText('Ожидание финансирования'))
    userEvent.click(screen.getByText('Кредит одобрен'))
    userEvent.click(screen.getByText('Отказ'))

    expect(change).toBeCalledTimes(7)
  })

  describe('Передаются верные параметры в onChange при клике на', () => {
    it('Черновик', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Черновик'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.INITIAL])
      userEvent.click(screen.getByText('Черновик'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })

    it('Актуальные заявки', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Актуальные заявки'))
      expect(change).toHaveBeenNthCalledWith(1, [
        StatusCode.INITIAL,
        StatusCode.PROCESSED,
        StatusCode.APPROVED,
        StatusCode.FINALLY_APPROVED,
        StatusCode.FORMATION,
        StatusCode.AUTHORIZED,
        StatusCode.ISSUED,
        StatusCode.ERROR,
      ])
      userEvent.click(screen.getByText('Актуальные заявки'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })
    it('Ожидает решение', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Ожидает решение'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.PROCESSED])
      userEvent.click(screen.getByText('Ожидает решение'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })
    it('КД Отменен', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('КД Отменен'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.CANCELED_DEAL])
      userEvent.click(screen.getByText('КД Отменен'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })
    it('Ожидание финансирования', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Ожидание финансирования'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.AUTHORIZED])
      userEvent.click(screen.getByText('Ожидание финансирования'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })
    it('Кредит одобрен', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Кредит одобрен'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.FINALLY_APPROVED])
      userEvent.click(screen.getByText('Кредит одобрен'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })
    it('Отказ', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Отказ'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.REJECTED])
      userEvent.click(screen.getByText('Отказ'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })
    it('Отказ по клиенту', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Отказ по клиенту'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.CLIENT_REJECTED])
      userEvent.click(screen.getByText('Отказ по клиенту'))
      expect(change).toHaveBeenNthCalledWith(2, [])
    })
    it('Актуальные заявки + Черновик', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Черновик'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.INITIAL])
      userEvent.click(screen.getByText('Актуальные заявки'))
      expect(change).toHaveBeenNthCalledWith(2, [
        StatusCode.INITIAL,
        StatusCode.PROCESSED,
        StatusCode.APPROVED,
        StatusCode.FINALLY_APPROVED,
        StatusCode.FORMATION,
        StatusCode.AUTHORIZED,
        StatusCode.ISSUED,
        StatusCode.ERROR,
      ])
      userEvent.click(screen.getByText('Актуальные заявки'))
      expect(change).toHaveBeenNthCalledWith(3, [StatusCode.INITIAL])
    })
    it('Актуальные заявки + Отказ', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Отказ'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.REJECTED])
      userEvent.click(screen.getByText('Актуальные заявки'))
      expect(change).toHaveBeenNthCalledWith(2, [
        StatusCode.REJECTED,
        StatusCode.INITIAL,
        StatusCode.PROCESSED,
        StatusCode.APPROVED,
        StatusCode.FINALLY_APPROVED,
        StatusCode.FORMATION,
        StatusCode.AUTHORIZED,
        StatusCode.ISSUED,
        StatusCode.ERROR,
      ])
      userEvent.click(screen.getByText('Отказ'))
      expect(change).toHaveBeenNthCalledWith(3, [
        StatusCode.INITIAL,
        StatusCode.PROCESSED,
        StatusCode.APPROVED,
        StatusCode.FINALLY_APPROVED,
        StatusCode.FORMATION,
        StatusCode.AUTHORIZED,
        StatusCode.ISSUED,
        StatusCode.ERROR,
      ])
    })
    it('Кредит одобрен + Отказ', () => {
      const change = jest.fn()

      render(
        <ThemeProviderMock>
          <StatusFilter onChange={change} />
        </ThemeProviderMock>,
      )

      userEvent.click(screen.getByText('Отказ'))
      expect(change).toHaveBeenNthCalledWith(1, [StatusCode.REJECTED])
      userEvent.click(screen.getByText('Кредит одобрен'))
      expect(change).toHaveBeenNthCalledWith(2, [StatusCode.REJECTED, StatusCode.FINALLY_APPROVED])
      userEvent.click(screen.getByText('Отказ'))
      expect(change).toHaveBeenNthCalledWith(3, [StatusCode.FINALLY_APPROVED])
      userEvent.click(screen.getByText('Кредит одобрен'))
      expect(change).toHaveBeenNthCalledWith(4, [])
    })
  })
})
