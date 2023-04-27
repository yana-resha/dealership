import { createContext, useContext } from 'react'

type AuthContextValue = {
  isAuth?: boolean
}

export const AuthContext = createContext<AuthContextValue>({
  isAuth: undefined,
})

export const useAuthContext = () => useContext(AuthContext)
