import { useCallback, useState } from 'react'

import { Box, Button, IconButton, Typography } from '@mui/material'

import { ReactComponent as AddingFolder } from 'assets/icons/addingFolder.svg'
import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { ReactComponent as UploadingFile } from 'assets/icons/uploadingFile.svg'
import { Role } from 'shared/api/requests/authdc'
import {
  useCreateCatalogMutation,
  useGetCatalogQuery,
  useUploadFileMutation,
} from 'shared/api/requests/fileStorageDc.api'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { FileUploadButton } from 'shared/ui/FileUploadButton'

import { allowedFileTypes } from '../Catalog.config'
import { useStyles } from './CatalogHeader.styles'
import { NameDialog } from './NameDialog/NameDialog'

const MAX_FILE_SIZE_MB = 20

interface CatalogHeaderProps {
  currentFolderId: number
  onBack: (folderId: number) => void
}
export function CatalogHeader({ currentFolderId, onBack }: CatalogHeaderProps) {
  const styles = useStyles()
  const [isVisible, setVisible] = useState(false)
  const roles = useAppSelector(state => state.user.user?.roles)
  const isContentManager = roles?.[Role.FrontdcContentManager] ?? false

  const { data: catalogData, refetch: refetchGetCatalog } = useGetCatalogQuery(
    { folderId: currentFolderId },
    { enabled: false },
  )
  const { mutate: createCatalogMutate } = useCreateCatalogMutation()
  const { mutate: uploadFileMutate } = useUploadFileMutation()

  const closeModal = useCallback(() => setVisible(false), [])
  const createCatalog = useCallback(
    (newName: string) => {
      createCatalogMutate(
        { folderId: currentFolderId, name: newName },
        {
          onSuccess: () => {
            refetchGetCatalog()
          },
        },
      )
      setVisible(false)
    },
    [createCatalogMutate, currentFolderId, refetchGetCatalog],
  )
  const handleBackClick = useCallback(() => {
    if (typeof catalogData?.prevFolderId === 'number') {
      onBack(catalogData?.prevFolderId)
    }
  }, [catalogData?.prevFolderId, onBack])

  const handleUpload = useCallback(
    (files: FileList) => {
      const file = files.item(0)
      if (file) {
        uploadFileMutate(
          { document: file, folderId: currentFolderId },
          {
            onSuccess: () => refetchGetCatalog(),
          },
        )
      }
    },
    [currentFolderId, refetchGetCatalog, uploadFileMutate],
  )

  return (
    <Box className={styles.container}>
      <Box className={styles.titleContainer}>
        {currentFolderId ? (
          <IconButton data-testid="backBtn" className={styles.iconButton} onClick={handleBackClick}>
            <KeyboardArrowLeft />
          </IconButton>
        ) : (
          <Box className={styles.iconButton} />
        )}
        <Typography className={styles.pageTitle}>{catalogData?.folderName || 'Документы'}</Typography>
      </Box>

      {isContentManager && (
        <Box className={styles.btnContainer}>
          <Button
            variant="text"
            data-testid="createCatalogBtn"
            startIcon={<AddingFolder />}
            className={styles.createCatalogBtn}
            onClick={() => setVisible(true)}
          >
            Создать папку
          </Button>

          <FileUploadButton
            onChange={handleUpload}
            icon={<UploadingFile />}
            buttonText="Загрузить файл"
            allowedFileTypes={allowedFileTypes}
            maxFileSizeMb={MAX_FILE_SIZE_MB}
          />
        </Box>
      )}

      <NameDialog onSubmit={createCatalog} isVisible={isVisible} onClose={closeModal} />
    </Box>
  )
}
