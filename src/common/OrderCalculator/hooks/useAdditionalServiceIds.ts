import { useCallback, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { ChangingIdsOption } from '../constants'

export function useAdditionalServiceIds() {
  const [ids, setIds] = useState([uuidv4()])

  const changeIds = useCallback((idx: number, changingOption: string, minItems = 1) => {
    switch (changingOption) {
      case ChangingIdsOption.add:
        setIds(prev => [...prev.slice(0, idx + 1), uuidv4(), ...prev.slice(idx + 1)])
        break
      case ChangingIdsOption.remove:
        setIds(prev => [...prev.slice(0, idx), ...prev.slice(idx + 1)])
        break
      case ChangingIdsOption.clear:
        setIds([...Array(minItems)].map(() => uuidv4()))
        break
    }
  }, [])

  return { ids, changeIds }
}
