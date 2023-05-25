import { useState } from 'react'

import createContext from 'shared/utils/createContext'

interface ContextValue {
  specialMark: string
  onChangeSpecialMark: (value: string) => void
}

export const [SpecialMarkContext, useSpecialMarkContext] = createContext<ContextValue>({
  specialMark: '',
  onChangeSpecialMark: () => null,
})

export function SpecialMarkContextWrapper({ children }: React.PropsWithChildren<{}>) {
  const [specialMarkValue, setSpecialMarkValue] = useState('')

  return (
    <SpecialMarkContext specialMark={specialMarkValue} onChangeSpecialMark={setSpecialMarkValue}>
      {children}
    </SpecialMarkContext>
  )
}
