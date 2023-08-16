import { RequisitesForFinancing } from 'entities/application/AdditionalOptionsRequisites/hooks/useRequisitesForFinancingQuery'
import createContext from 'shared/utils/createContext'

const defaultValue = {
  requisites: undefined as RequisitesForFinancing | undefined,
  isRequisitesFetched: false,
}

export const [RequisitesContextProvider, useRequisitesContext] = createContext(defaultValue)
