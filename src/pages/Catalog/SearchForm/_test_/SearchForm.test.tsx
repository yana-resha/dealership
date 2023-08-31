import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { foundData } from 'shared/api/requests/fileStorageDc.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { SearchForm } from '../SearchForm'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

const setFileName = jest.fn()
const onFoundFile = jest.fn()
const onReset = jest.fn()
const mockedFindCatalogMutate = jest.fn()
const mockedData = foundData

jest.mock('shared/api/requests/fileStorageDc.api', () => ({
  ...jest.requireActual('shared/api/requests/fileStorageDc.api'),
  useFindCatalogMutation: () => ({
    mutate: mockedFindCatalogMutate,
    data: mockedData,
    isLoading: false,
  }),
}))

disableConsole('error')

describe('CatalogHeader', () => {
  describe('Элементы отображаются корректно', () => {
    it('Автокомплит отображает корректные подсказки', async () => {
      render(
        <SearchForm
          fileName="fileName"
          setFileName={setFileName}
          onFoundFile={onFoundFile}
          onReset={onReset}
        />,
        {
          wrapper: createWrapper,
        },
      )

      const searchInput = document.querySelector('#searchInput')
      userEvent.click(searchInput as Element)

      expect(await screen.findByText('folder_1 / fileName_1')).toBeInTheDocument()
      expect(await screen.findByText('folder_2 / fileName_2')).toBeInTheDocument()

      userEvent.click(await screen.findByText('folder_2 / fileName_2'))
      expect(setFileName).toHaveBeenCalled()
      expect(onFoundFile).toHaveBeenCalled()
    })
  })
})
