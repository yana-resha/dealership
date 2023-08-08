import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockProviders } from 'tests/mocks'

import { FileDownloader } from '../FileDownloader'

const blob = new Blob([''], { type: 'text/html' })
const file: File = new File([blob], 'file')
const deleteFn = jest.fn()

describe('FileDownloader', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn()
  })

  it('корректная отрисовка компонента', () => {
    global.URL.createObjectURL = jest.fn().mockReturnValueOnce('foo.pdf')

    render(
      <MockProviders>
        <FileDownloader file={file} index={0} onClickDelete={deleteFn} />
      </MockProviders>,
    )

    expect(screen.getByText('file')).toBeVisible()
    expect(screen.getByRole('button')).toBeVisible()
    expect(screen.getByRole('img')).toBeVisible()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'document.svg')
  })
  it('при клике на крестик вызывается onClickDelete', () => {
    render(
      <MockProviders>
        <FileDownloader file={file} index={0} onClickDelete={deleteFn} />
      </MockProviders>,
    )

    userEvent.click(screen.getByRole('button'))

    expect(deleteFn).toBeCalledTimes(1)
    expect(deleteFn).toBeCalledWith(0)
  })
  it('если нет превью то показываем CircularProgress', () => {
    render(
      <MockProviders>
        <FileDownloader file={file} index={0} onClickDelete={deleteFn} />
      </MockProviders>,
    )

    expect(screen.getByTestId('circularProgressWheel')).toBeInTheDocument()
  })
})