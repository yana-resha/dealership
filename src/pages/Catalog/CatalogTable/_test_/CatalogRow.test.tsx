import { PropsWithChildren } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import * as useUserRolesModule from 'entities/user/hooks/useUserRoles'
import { catalogData } from 'shared/api/requests/fileStorageDc.mock'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { CatalogRow } from '../CatalogRow'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>
const mockedUseUserRoles = jest.spyOn(useUserRolesModule, 'useUserRoles')

disableConsole('error')

const onRowClick = jest.fn()
const onRemove = jest.fn()

describe('CatalogRow', () => {
  describe('Данные в строке отображаются корректно', () => {
    beforeEach(() => {
      mockedUseUserRoles.mockImplementation(() => ({ isContentManager: false, isCreditExpert: false }))
    })

    it('Отображение папки', async () => {
      render(<CatalogRow data={catalogData.catalog[0]} onRowClick={onRowClick} onRemove={onRemove} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('myFolder_2')).toBeInTheDocument()
      expect(screen.queryByText('25 августа 2023 г., 11:24')).toBeInTheDocument()
      expect(screen.queryByTestId('folderIcon')).toBeInTheDocument()
      expect(screen.queryByTestId('fileIcon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('cartIcon')).not.toBeInTheDocument()

      // Функция удаления не вызывается
      fireEvent.click(await screen.findByTestId('cartCell'))
      expect(onRowClick).toHaveBeenCalled()
      expect(onRemove).not.toHaveBeenCalled()
    })

    it('Отображение файла', async () => {
      render(<CatalogRow data={catalogData.catalog[1]} onRowClick={onRowClick} onRemove={onRemove} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('logo192.png')).toBeInTheDocument()
      expect(screen.queryByText('Сегодня, 00:00')).toBeInTheDocument()
      expect(screen.queryByTestId('folderIcon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('fileIcon')).toBeInTheDocument()
      expect(screen.queryByTestId('cartIcon')).not.toBeInTheDocument()

      // Функция удаления не вызывается
      fireEvent.click(await screen.findByTestId('cartCell'))
      expect(onRowClick).not.toHaveBeenCalled()
      expect(onRemove).not.toHaveBeenCalled()
    })

    it('Если есть роль FrontdcContentManager, то разрешено удаление', async () => {
      mockedUseUserRoles.mockImplementation(() => ({ isContentManager: true, isCreditExpert: false }))
      render(<CatalogRow data={catalogData.catalog[0]} onRowClick={onRowClick} onRemove={onRemove} />, {
        wrapper: createWrapper,
      })

      fireEvent.click(await screen.findByTestId('cartCell'))
      expect(onRowClick).not.toHaveBeenCalled()
      expect(onRemove).toHaveBeenCalled()
    })
  })
})
