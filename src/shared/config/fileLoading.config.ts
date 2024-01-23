import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { megaBiteToBite } from 'shared/utils/megaBiteToBite'

export const DEFAULT_MAX_FILE_SIZE_MB = 15
export const defaultMaxFileSizeBite = megaBiteToBite(DEFAULT_MAX_FILE_SIZE_MB)
export const DEFAULT_ALLOWED_FILE_TYPES = 'image/jpeg,image/png,application/pdf'
export const DEFAULT_FILE_NAME = 'Файл'

export const FILE_SHORT_NAME_MAP = {
  [DocumentType.CREDIT_CONTRACT]: 'ИУК',
  [DocumentType.FEE_SCHEDULE]: 'График фин',
  [DocumentType.ACCOUNT_OPEN_FORM]: 'Счет',
  [DocumentType.STATEMENT_FORM]: 'Заявление-анкета',
  [DocumentType.ESTIMATED_FEE_SCHEDULE]: 'График пред',
  [DocumentType.SHARING_FORM]: 'Письмо об одобрении',
  [DocumentType.PDN_NOTIFICATION_FORM]: 'Уведомление о ПДН',
  [DocumentType.ADD_OPTIONS_APPLICATION]: 'Заявление на ДУ',
  [DocumentType.ADD_OPTIONS_NOTIFICATION]: 'Уведомление о ДУ',
}
