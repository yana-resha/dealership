import { createContext, useContext } from 'react'

type FormProviderProps = {
  onGetOrderId?: () => Promise<string | undefined>
}

/** Позволяет получить id заявки в каждом месте анкеты клиента */
const ApplicationContext = createContext<FormProviderProps>({
  onGetOrderId: undefined,
})

export const useApplicationContext = () => useContext(ApplicationContext)

/** Позволяет передавать id заявки дочерним компонентам */
export const ApplicationProvider = (props: React.PropsWithChildren<FormProviderProps>) => {
  const { children, onGetOrderId } = props

  return <ApplicationContext.Provider value={{ onGetOrderId }}>{children}</ApplicationContext.Provider>
}
