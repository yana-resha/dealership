import React, { useCallback } from 'react'

import { Close } from '@mui/icons-material'
import { Avatar, IconButton, Skeleton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'

import SberTypography from '../SberTypography'

const useStyles = makeStyles(theme => ({
  avatar: {
    '&.MuiAvatar-root': {
      width: 32,
      height: 32,
      marginRight: theme.spacing(1),
    },
  },
  text: {
    color: theme.palette.primary.main,
  },
}))

type Props = {
  file: File
  index: number
  onClickDelete: (index: number) => void
}

export const UploadFile = ({ file, index, onClickDelete }: Props) => {
  const styles = useStyles()

  const preview = URL.createObjectURL(file)

  const deleteFile = useCallback(() => {
    onClickDelete(index)
  }, [onClickDelete, index])

  return (
    <Box data-testid="uploadFile" display="flex" alignItems="center" gap={1}>
      <Avatar variant="square" className={styles.avatar}>
        {preview ? (
          <img width="100%" height="100%" src={preview} />
        ) : (
          <Skeleton
            data-testid="uploadFileSkeleton"
            variant="rectangular"
            width={32}
            height={32}
            animation="wave"
          />
        )}
      </Avatar>

      <SberTypography className={styles.text} sberautoVariant="body3" component="p">
        {file.name}
      </SberTypography>

      <IconButton data-testid="deleteFileButton" size="small" onClick={deleteFile}>
        <Close />
      </IconButton>
    </Box>
  )
}
