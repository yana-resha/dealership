import { useCallback, useState } from 'react'

import { Box } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

import { useGetCatalogQuery } from 'shared/api/requests/fileStorageDc.api'
import { appRoutes } from 'shared/navigation/routerPath'

import { useStyles } from './Catalog.styles'
import { CatalogHeader } from './CatalogHeader/CatalogHeader'
import { CatalogTable } from './CatalogTable/CatalogTable'
import { SearchForm } from './SearchForm/SearchForm'

export function Catalog() {
  const styles = useStyles()
  const navigate = useNavigate()
  const params = useParams()

  const currentFolderId = params.folderId ? parseInt(params.folderId, 10) : 0
  const [foundedFileName, setFoundedFileName] = useState('')
  const [fileName, setFileName] = useState('')

  useGetCatalogQuery({ folderId: currentFolderId })

  const resetFoundedFileName = useCallback(() => setFoundedFileName(''), [])
  const changeFolder = useCallback(
    (folderId: number) => navigate(appRoutes.documentStorageFolder(`${folderId}`)),
    [navigate],
  )
  const handleBack = useCallback(
    (folderId: number) => {
      changeFolder(folderId)
      resetFoundedFileName()
      setFileName('')
    },
    [changeFolder, resetFoundedFileName],
  )
  const handleFoundFile = useCallback(
    (fileName?: string, folderId?: number) => {
      if (fileName && typeof folderId == 'number') {
        setFoundedFileName(fileName)
        changeFolder(folderId)
      }
      if (!fileName) {
        resetFoundedFileName()
      }
    },
    [changeFolder, resetFoundedFileName],
  )

  return (
    <div className={styles.page} data-testid="catalog">
      <Box className={styles.loaderContainer}>
        <CatalogHeader currentFolderId={currentFolderId} onBack={handleBack} />

        <Box className={styles.searchContainer}>
          <SearchForm
            fileName={fileName}
            setFileName={setFileName}
            onFoundFile={handleFoundFile}
            onReset={resetFoundedFileName}
          />
        </Box>

        <CatalogTable
          currentFolderId={currentFolderId}
          onFolderClick={changeFolder}
          foundedFileName={foundedFileName}
        />
      </Box>
    </div>
  )
}
