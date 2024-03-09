import { useCallback } from 'react'

import { Box, Button } from '@mui/material'

import { useGetCatalogQuery, useRemoveCatalogMutation } from 'shared/api/requests/fileStorageDc.api'
import { ModalDialog } from 'shared/ui/ModalDialog'
import SberTypography from 'shared/ui/SberTypography'

import { RemovedFile } from '../CatalogTable.types'
import useStyles from './RemoveModal.styles'

type Props = {
  currentFolderId: number
  removedFile: RemovedFile | undefined
  closeModal: () => void
}

export const RemoveModal = ({ currentFolderId, removedFile, closeModal }: Props) => {
  const styles = useStyles()

  const { refetch: refetchGetCatalog } = useGetCatalogQuery({ folderId: currentFolderId }, { enabled: false })

  const { mutate: removeCatalogMutate } = useRemoveCatalogMutation()

  const submitRemove = useCallback(() => {
    if (removedFile?.id) {
      removeCatalogMutate(
        { id: removedFile.id },
        {
          onSuccess: () => {
            refetchGetCatalog()
            closeModal()
          },
        },
      )
    }
  }, [closeModal, refetchGetCatalog, removeCatalogMutate, removedFile?.id])

  const entity = removedFile?.isFile ? 'файл' : 'папку'

  return (
    <ModalDialog isVisible={!!removedFile} label="" onClose={closeModal}>
      <SberTypography sberautoVariant="body3" component="p">
        {`Вы действительно хотите удалить ${entity} “${removedFile?.name || ''}”?`}
      </SberTypography>

      <Box className={styles.btnContainer}>
        <Button variant="contained" className={styles.btn} onClick={submitRemove}>
          Да
        </Button>
        <Button variant="outlined" className={styles.btn} onClick={closeModal}>
          Отменить
        </Button>
      </Box>
    </ModalDialog>
  )
}
