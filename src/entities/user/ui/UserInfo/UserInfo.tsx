import { useEffect } from 'react'

import { Box, Skeleton, Typography } from '@mui/material'
import { useQuery } from 'react-query'

import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { getUser } from '../../api/requests'
import { slUserMainInfo } from '../../model/selectors/slUserMainInfo'
import { setUserInfo } from '../../model/userSlice'

export function UserInfo() {
  const creditExpert = useAppSelector(state => slUserMainInfo(state))
  const dispatch = useAppDispatch()

  const {
    data: user,
    error,
    isLoading,
  } = useQuery(['getUser'], () => getUser({}), {
    cacheTime: Infinity,
  })

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
