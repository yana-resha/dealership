import { createContext, useContext } from 'react'

type AuthContextValue = {
  isAuth?: boolean
  logoutUrl: string | undefined
  setLogoutUrl: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const AuthContext = createContext<AuthContextValue>({
  isAuth: undefined,
  logoutUrl: undefined,
  setLogoutUrl: () => undefined,
})

export const useAuthContext = () => useContext(AuthContext)
