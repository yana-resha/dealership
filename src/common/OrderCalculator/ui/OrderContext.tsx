import createContext from 'shared/utils/createContext'

const defaultValue = {
  scrolContainer: null as null | HTMLElement,
}

export const [OrderContext, useOrderContext] = createContext(defaultValue)
