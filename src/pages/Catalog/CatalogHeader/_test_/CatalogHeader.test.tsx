import { PropsWithChildren } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import * as useUserRolesModule from 'entities/user/hooks/useUserRoles'
import * as useGetCatalogQueryModule from 'shared/api/requests/fileStorageDc.api'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { CatalogHeader } from '../CatalogHeader'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>
const mockedUseGetCatalogQuery = jest.spyOn(useGetCatalogQueryModule, 'useGetCatalogQuery')
const mockedUseUserRoles = jest.spyOn(useUserRolesModule, 'useUserRoles')
const onBack = jest.fn()

disableConsole('error')

describe('CatalogHeader', () => {
  beforeEach(() => {
    mockedUseGetCatalogQuery.mockImplementation(() => ({ data: { prevFolderId: 1 } } as any))
    mockedUseUserRoles.mockImplementation(() => ({ isContentManager: true, isCreditExpert: false }))
  })
  describe('Элементы отображаются корректно', () => {
    it('Если отсутствует роль FrontdcContentManager, то не отображаются кнопки', () => {
      mockedUseUserRoles.mockImplementation(() => ({ isContentManager: false, isCreditExpert: false }))
      render(<CatalogHeader currentFolderId={0} onBack={onBack} />, {
        wrapper: createWrapper,
      })
      expect(screen.queryByTestId('createCatalogBtn')).not.toBeInTheDocument()
      expect(screen.queryByTestId('fileUploadButtonInput')).not.toBeInTheDocument()
    })

    it('Если есть роль FrontdcContentManager, то отображаются кнопки', () => {
      render(<CatalogHeader currentFolderId={0} onBack={onBack} />, {
        wrapper: createWrapper,
      })
      const createCatalogBtn = screen.getByTestId('createCatalogBtn')
      expect(createCatalogBtn).toBeInTheDocument()
      expect(screen.queryByTestId('fileUploadButtonInput')).toBeInTheDocument()
    })

    it('При создании папки появляется модальное окно', async () => {
      render(<CatalogHeader currentFolderId={0} onBack={onBack} />, {
        wrapper: createWrapper,
      })
      fireEvent.click(screen.getByTestId('createCatalogBtn'))
      expect(await screen.findByTestId('nameDialog')).toBeInTheDocument()
    })

    it('В корневой папке отсутствует кнопка Назад', () => {
      render(<CatalogHeader currentFolderId={0} onBack={onBack} />, {
        wrapper: createWrapper,
      })
      expect(screen.queryByTestId('backBtn')).not.toBeInTheDocument()
    })

    it('В дочерних папках присутствует кнопка Назад', async () => {
      render(<CatalogHeader currentFolderId={2} onBack={onBack} />, {
        wrapper: createWrapper,
      })
      const backBtn = screen.getByTestId('backBtn')
      expect(backBtn).toBeInTheDocument()
      fireEvent.click(backBtn)
      expect(onBack).toHaveBeenCalled()
    })
  })
})
