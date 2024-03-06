import { Box, Skeleton, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { useGetUserQuery } from 'entities/user'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { slUserMainInfo } from '../../model/selectors/slUserMainInfo'

const useStyles = makeStyles(() => ({
  container: { marginRight: 0, marginLeft: 'auto' },
}))

export function UserInfo() {
  const classes = useStyles()
  const creditExpert = useAppSelector(state => slUserMainInfo(state))
  const { error, isLoading } = useGetUserQuery()

  return (
    <Box minWidth={200} textAlign="right" className={classes.container}>
      {isLoading || !!error ? (
        <>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </>
      ) : (
        <>
          <Typography>{creditExpert.name}</Typography>
          <Typography>{creditExpert.phoneNumber}</Typography>
        </>
      )}
    </Box>
  )
}
