import { useEffect } from 'react'

import { Box, Skeleton, Typography } from '@mui/material'

import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { getUser } from '../../api/requests'
import { slUserMainInfo } from '../../model/selectors/slUserMainInfo'
import { setUserInfo } from '../../model/userSlice'

export function UserInfo() {
  const creditExpert = useAppSelector(state => slUserMainInfo(state))
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = await getUser({})

        dispatch(setUserInfo(user))
      } catch (err) {
        console.log('getUser.err', err)
      }
    }

    fetch()
  }, [dispatch])

  const isLoading = !creditExpert.name && !creditExpert.phoneNumber

  return (
    <Box minWidth={200} textAlign="right">
      {isLoading ? (
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
