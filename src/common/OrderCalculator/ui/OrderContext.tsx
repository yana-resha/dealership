import createContext from 'shared/utils/createContext'

const defaultValue = {
  onChangeForm: (saveValuesToStore: () => void) => {},
}

export const [OrderContext, useOrderContext] = createContext(defaultValue)
