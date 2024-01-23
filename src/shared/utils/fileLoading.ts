import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { FILE_SHORT_NAME_MAP } from 'shared/config/fileLoading.config'

export const transformFileName = (documentType?: DocumentType, prefix?: string) => {
  const newName = FILE_SHORT_NAME_MAP[(documentType || 0) as keyof typeof FILE_SHORT_NAME_MAP] as
    | string
    | undefined

  return newName ? (prefix ? `${prefix}_${newName}` : newName) : undefined
}
