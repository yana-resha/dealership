import { useEffect } from 'react'

import { TableType } from '../constants'

export const useInitialTablePagesClearing = () => {
  useEffect(() => {
    const handleBeforeUnload = (evt: BeforeUnloadEvent) => {
      const storageKeys = Object.values(TableType)

      storageKeys.forEach(key => {
        sessionStorage.removeItem(key)
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return
}
