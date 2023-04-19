import React, { createContext, useContext } from 'react'

import SnackbarError, { SnackbarErrorRef } from './subcomponents/SnackbarError'

interface SnackbarErrorContextValue {
  snackbarErrorRef: React.RefObject<SnackbarErrorRef> | null
}

const SnackbarErrorContext = createContext<SnackbarErrorContextValue>({
  snackbarErrorRef: null,
})

export const useSnackbarErrorContext = () => {
  const { snackbarErrorRef } = useContext(SnackbarErrorContext)

  return snackbarErrorRef?.current
}

type SnackbarErrorProviderProps = React.PropsWithChildren<{}>

export const SnackbarErrorProvider: React.FC<SnackbarErrorProviderProps> = ({ children }) => {
  const snackbarErrorRef = React.useRef<SnackbarErrorRef>(null)

  return (
    <SnackbarErrorContext.Provider value={{ snackbarErrorRef }}>
      {children}
      <SnackbarError ref={snackbarErrorRef} />
    </SnackbarErrorContext.Provider>
  )
}
