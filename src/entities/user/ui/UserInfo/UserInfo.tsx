import { useEffect } from 'react'

import { Box, Skeleton, Typography } from '@mui/material'

import { useGetUserQuery } from 'shared/api/requests/authdc'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { slUserMainInfo } from '../../model/selectors/slUserMainInfo'
import { setUserInfo } from '../../model/userSlice'

export function UserInfo() {
  const creditExpert = useAppSelector(state => slUserMainInfo(state))
  const dispatch = useAppDispatch()

  const { data: user, error, isLoading } = useGetUserQuery()

  useEffect(() => {
    if (user) {
      dispatch(setUserInfo(user))
    }
  }, [dispatch, user])

  return (
    <Box minWidth={200} textAlign="right">
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
