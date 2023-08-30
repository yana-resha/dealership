import { useCallback, useEffect, useState } from 'react'

import { Box, Button } from '@mui/material'

import { maskFolderName } from 'shared/masks/InputMasks'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { ModalDialog } from 'shared/ui/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useStyles } from './NameDialog.styles'

interface Props {
  isVisible: boolean
  onClose: () => void
  onSubmit: (newName: string) => void
}
export function NameDialog({ isVisible, onClose, onSubmit }: Props) {
  const styles = useStyles()

  const [isDisabledSubmit, setDisabledSubmit] = useState(true)
  const [newCatalogName, setNewCatalogName] = useState<string | undefined>()
  const handleNameChange = useCallback((newName: string) => setNewCatalogName(newName), [])
  const handleSubmit = useCallback(() => {
    if (newCatalogName) {
      onSubmit(newCatalogName)
      setNewCatalogName(undefined)
    }
  }, [newCatalogName, onSubmit])

  useEffect(() => {
    if (newCatalogName && isDisabledSubmit) {
      setDisabledSubmit(false)
    }
    if (!newCatalogName && !isDisabledSubmit) {
      setDisabledSubmit(true)
    }
  }, [isDisabledSubmit, newCatalogName])

  return (
    <ModalDialog isVisible={isVisible} label="" onClose={onClose}>
      <SberTypography sberautoVariant="body3" component="p">
        Введите имя папки
      </SberTypography>

      <Box className={styles.inputContainer}>
        <MaskedInput mask={maskFolderName} value={newCatalogName} onChange={handleNameChange} autoFocus />
      </Box>

      <Button onClick={handleSubmit} variant="contained" disabled={isDisabledSubmit}>
        ОК
      </Button>
    </ModalDialog>
  )
}
