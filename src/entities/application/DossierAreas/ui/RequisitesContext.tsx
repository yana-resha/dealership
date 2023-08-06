import createContext from 'shared/utils/createContext'

import { RequisitesForFinancing } from '../hooks/useRequisitesForFinancingQuery'

const defaultValue = {
  requisites: undefined as RequisitesForFinancing | undefined,
  isRequisitesFetched: false,
}

export const [RequisitesContextProvider, useRequisitesContext] = createContext(defaultValue)
