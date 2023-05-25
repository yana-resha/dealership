import React, { useMemo } from 'react'

function createContext<T>(
  defaultValue: T,
): readonly [React.FunctionComponent<React.PropsWithChildren<T>>, () => T] {
  const Context = React.createContext<T>(defaultValue)

  function ContextProvider({ children, ...props }: React.PropsWithChildren<T>) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = useMemo(() => props as T, [...Object.values(props)])

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useContext() {
    return React.useContext(Context)
  }

  return [ContextProvider, useContext]
}

export default createContext
