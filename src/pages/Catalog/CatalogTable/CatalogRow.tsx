import { memo, useCallback, useMemo } from 'react'

import { Box, TableCell, TableRow } from '@mui/material'
import { ObjectType } from '@sberauto/filestoragedc-proto/public'
import cx from 'classnames'
import { DateTime } from 'luxon'

import { ReactComponent as CartIcon } from 'assets/icons/cart.svg'
import { ReactComponent as FileIcon } from 'assets/icons/file.svg'
import { ReactComponent as FolderIcon } from 'assets/icons/folder.svg'
import { ReactComponent as ImageFileIcon } from 'assets/icons/imageFile.svg'
import { ReactComponent as TableFileIcon } from 'assets/icons/tableFile.svg'
import { ReactComponent as TextFileIcon } from 'assets/icons/textFile.svg'
import { useUserRoles } from 'entities/user'
import { RequiredCatalog, useDownloadFileMutation } from 'shared/api/requests/fileStorageDc.api'
import { DEFAULT_FILE_NAME } from 'shared/config/fileLoading.config'

import { imageExtensions, tableExtensions, textExtensions } from '../Catalog.config'
import useStyles from './CatalogTable.styles'

type Props = {
  data: RequiredCatalog
  onRowClick: (id: number) => void
  onRemove: (id: number, name: string) => void
}

const CatalogRow = ({ data, onRowClick, onRemove }: Props) => {
  const styles = useStyles()
  const { isContentManager } = useUserRoles()

  const { mutateAsync: downloadFileMutate } = useDownloadFileMutation()

  const isFile = data.type === ObjectType.FILE

  const icon = useMemo(() => {
    if (imageExtensions.includes(data.extension || '')) {
      return <ImageFileIcon data-testid="fileIcon" />
    }
    if (textExtensions.includes(data.extension || '')) {
      return <TextFileIcon data-testid="fileIcon" />
    }
    if (tableExtensions.includes(data.extension || '')) {
      return <TableFileIcon data-testid="fileIcon" />
    }
    if (isFile) {
      return <FileIcon data-testid="fileIcon" />
    }

    return <FolderIcon data-testid="folderIcon" />
  }, [data.extension, isFile])

  const date = useMemo(() => {
    if (!data.downloadDate) {
      return ''
    }
    const downloadDate = DateTime.fromJSDate(new Date(data.downloadDate)).setLocale('ru')
    const downloadDateStr = downloadDate.hasSame(DateTime.fromJSDate(new Date()), 'day')
      ? downloadDate.toFormat('Сегодня, HH:mm')
      : downloadDate.toFormat('dd MMMM yyyy г., HH:mm')

    return downloadDateStr
  }, [data.downloadDate])

  const downloadFile = useCallback(async () => {
    try {
      const downloadedBlob = await downloadFileMutate({ id: data.id })
      const downloadedFile = new File([downloadedBlob], data.name || DEFAULT_FILE_NAME)
      const downloadURL = URL.createObjectURL(downloadedFile)
      const simulateLink = document.createElement('a')
      simulateLink.href = downloadURL
      simulateLink.download = downloadedFile.name
      simulateLink.click()
      URL.revokeObjectURL(downloadURL)
    } catch (error) {
      console.error('Error downloading the file:', error)
    }
  }, [data.id, data.name, downloadFileMutate])

  const handleItemClick = useCallback(() => {
    if (isFile) {
      downloadFile()
    } else {
      onRowClick(data.id)
    }
  }, [data.id, downloadFile, isFile, onRowClick])

  const handleRemove = useCallback(() => {
    onRemove(data.id, data.name || 'Без имени')
  }, [data.id, data.name, onRemove])

  return (
    <TableRow key={data.name} className={styles.bodyRow}>
      <TableCell align="left" className={cx(styles.bodyCell, styles.iconCell)} onClick={handleItemClick}>
        <Box className={styles.iconContainer}>{icon}</Box>
      </TableCell>
      <TableCell align="left" className={styles.bodyCell} onClick={handleItemClick}>
        <Box className={styles.nameContainer}>{data.name || 'Без имени'}</Box>
      </TableCell>
      <TableCell align="left" className={styles.bodyCell} onClick={handleItemClick}>
        {date}
      </TableCell>
      <TableCell
        align="left"
        className={cx(styles.bodyCell, styles.iconCell)}
        onClick={isContentManager ? handleRemove : handleItemClick}
        data-testid="cartCell"
      >
        {isContentManager && (
          <Box className={styles.iconContainer} data-testid="cartIcon">
            <CartIcon />
          </Box>
        )}
      </TableCell>
    </TableRow>
  )
}

const memoizedCatalogRow = memo(CatalogRow)
export { memoizedCatalogRow as CatalogRow }
