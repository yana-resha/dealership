import { useEffect } from 'react'

import { clearTableSessions } from '../utils'

export const useInitialTablePagesClearing = () => {
  useEffect(() => {
    clearTableSessions()

    window.addEventListener('beforeunload', clearTableSessions)

    return () => window.removeEventListener('beforeunload', clearTableSessions)
  }, [])

  return
}
