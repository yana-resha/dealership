import React, { useCallback, useState } from 'react'

import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { ReactComponent as NoDocs } from 'assets/icons/nodocs.svg'
import { FileUploadBlock } from 'entities/FileUploadBlock/FileUploadBlock'
import SberTypography from 'shared/ui/SberTypography'

import { useFieldsConfig } from './DownloadClientDocs.hooks'

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(4, 3),
    borderRadius: 16,
    border: `1px dashed ${theme.palette.grey[600]}`,
    textAlign: 'center',
  },
  paper: {
    '&.MuiPaper-root': {
      backgroundColor: theme.palette.background.default,
      borderRadius: 16,
      alignItems: 'baseline',

      '&& > *': {
        width: '100%',
        boxSizing: 'border-box',
      },
    },
  },
  dialogContent: {
    '&& > *': {
      width: '100%',
      boxSizing: 'border-box',
      padding: theme.spacing(2, 3),
    },

    '&& > :not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
  },
}))

export const DownloadClientDocs = () => {
  const styles = useStyles()
  const { configFields } = useFieldsConfig()
  const [isVisible, setIsVisible] = useState(false)

  const onClick = useCallback(() => {
    setIsVisible(true)
  }, [])
  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [])

  return (
    <Box className={styles.wrapper}>
      <NoDocs />
      <SberTypography sberautoVariant="body3" component="p">
        Загрузить водительское удостоверение и скан паспорта, анкета
      </SberTypography>
      <Button variant="contained" color="primary" onClick={onClick}>
        Загрузить
      </Button>

      <Dialog classes={{ paper: styles.paper }} open={isVisible} maxWidth="xs" fullWidth onClose={onClose}>
        <Box display="flex" justifyContent="space-between" pt={2} px={3}>
          <SberTypography sberautoVariant="h5" component="p">
            Документы
          </SberTypography>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <div className={styles.dialogContent}>
          {configFields.map(({ uniqName, ...el }) => (
            <FileUploadBlock key={uniqName} uniqName={uniqName} {...el} />
          ))}
        </div>
      </Dialog>
    </Box>
  )
}
