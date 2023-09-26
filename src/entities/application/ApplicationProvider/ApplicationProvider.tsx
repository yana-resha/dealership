import createContext from 'shared/utils/createContext'

const defaultValue = {
  onGetOrderId: (() => Promise.resolve()) as () => Promise<string | undefined>,
}

export const [ApplicationProvider, useApplicationContext] = createContext(defaultValue)
