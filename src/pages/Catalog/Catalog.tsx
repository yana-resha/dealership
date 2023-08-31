import { useCallback, useState } from 'react'

import { Box } from '@mui/material'

import { useGetCatalogQuery } from 'shared/api/requests/fileStorageDc.api'

import { useStyles } from './Catalog.styles'
import { CatalogHeader } from './CatalogHeader/CatalogHeader'
import { CatalogTable } from './CatalogTable/CatalogTable'
import { SearchForm } from './SearchForm/SearchForm'

export function Catalog() {
  const styles = useStyles()

  const [currentFolderId, setCurrentFolderId] = useState(0)
  const [foundedFileName, setFoundedFileName] = useState('')
  const [fileName, setFileName] = useState('')

  useGetCatalogQuery({ folderId: currentFolderId })

  const resetFoundedFileName = useCallback(() => setFoundedFileName(''), [])
  const changeFolder = useCallback((folderId: number) => setCurrentFolderId(folderId), [])
  const handleBack = useCallback(
    (folderId: number) => {
      changeFolder(folderId)
      resetFoundedFileName()
      setFileName('')
    },
    [changeFolder, resetFoundedFileName],
  )
  const handleFoundFile = useCallback((fileName?: string, folderId?: number) => {
    if (fileName && typeof folderId == 'number') {
      setFoundedFileName(fileName)
      setCurrentFolderId(folderId)
    }
    if (!fileName) {
      setFoundedFileName('')
    }
  }, [])

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
