import React from 'react'

import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sleep } from 'shared/lib/sleep'
import { ThemeProviderMock } from 'tests/mocks'

import { DownloaderIcon } from '../DownloaderIcon'

const blob = new Blob([''], { type: 'text/html' })
const file = new File([blob], 'file')
const onDownloadFileFn = jest.fn()

describe('FileDownloader', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn()
    global.URL.revokeObjectURL = jest.fn()
  })

  it('Корректная отрисовка компонента при загрузке файла', async () => {
    onDownloadFileFn.mockImplementation(() => Promise.resolve(file))
    render(
      <ThemeProviderMock>
        <DownloaderIcon onDownloadFile={onDownloadFileFn} />,
      </ThemeProviderMock>,
    )
    userEvent.click(screen.getByTestId('downloaderLinkDownloader'))
    expect(await screen.findByTestId('downloaderLink')).toBeInTheDocument()
  })

  it('Корректная отрисовка компонента при неудачной загрузке файла', async () => {
    onDownloadFileFn.mockImplementation(() => Promise.resolve(undefined))
    render(
      <ThemeProviderMock>
        <DownloaderIcon onDownloadFile={onDownloadFileFn} />,
      </ThemeProviderMock>,
    )
    userEvent.click(screen.getByTestId('downloaderLinkDownloader'))
    expect(screen.queryByTestId('downloaderLink')).not.toBeInTheDocument()
  })

  it('если нет превью то показываем CircularProgress', async () => {
    onDownloadFileFn.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(file), 1000)
        }),
    )
    render(
      <ThemeProviderMock>
        <DownloaderIcon onDownloadFile={onDownloadFileFn} />,
      </ThemeProviderMock>,
    )
    userEvent.click(screen.getByTestId('downloaderLinkDownloader'))
    expect(await screen.findByTestId('circularProgressWheel')).toBeInTheDocument()
    await act(async () => await sleep(1000))
    expect(screen.queryByTestId('downloaderLink')).toBeInTheDocument()
  })
})
