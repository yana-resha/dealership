import React, { useCallback } from 'react'

import { Close } from '@mui/icons-material'
import { Avatar, CircularProgress, IconButton, Link } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'

import documentIcon from 'assets/icons/document.svg'

import SberTypography from '../SberTypography'

const useStyles = makeStyles(theme => ({
  avatar: {
    '&.MuiAvatar-root': {
      width: 32,
      height: 32,
      marginRight: theme.spacing(1),
      backgroundColor: 'transparent',
    },
  },
  text: {
    color: theme.palette.primary.main,
  },
  fileLink: {
    '&.MuiLink-root': {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      cursor: 'pointer',
      width: 'fit-content',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}))

type Props = {
  file: File | undefined
  index: number
  loadingMessage?: string
  onClick?: () => void
  onClickDelete?: (index: number) => void
}

export const UploadFile = ({ file, index, onClick, loadingMessage, onClickDelete }: Props) => {
  const styles = useStyles()
  const message = loadingMessage ? loadingMessage : 'Файл загружается...'

  const preview = file ? URL.createObjectURL(file) : undefined

  const deleteFile = useCallback(() => {
    if (onClickDelete) {
      onClickDelete(index)
    }
  }, [onClickDelete, index])

  return (
    <Box data-testid="uploadFile" display="flex" alignItems="center" gap={1} onClick={onClick}>
      <Link href={preview} className={styles.fileLink} target="_blank" download={file?.name} gap={1}>
        {preview ? (
          <Avatar variant="square" className={styles.avatar}>
            <img
              width="100%"
              height="100%"
              src={file && file.type.includes('image') ? preview : documentIcon}
            />
          </Avatar>
        ) : (
          <CircularProgress data-testid="uploadFileCircularProgress" size={32} />
        )}

        <SberTypography className={styles.text} sberautoVariant="body3" component="p">
          {file ? file.name : message}
        </SberTypography>
      </Link>
      {onClickDelete && (
        <IconButton data-testid="deleteFileButton" size="small" onClick={deleteFile}>
          <Close />
        </IconButton>
      )}
    </Box>
  )
}
