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
  [DocumentType.PATH_PROTECTION]: 'Пакет Защита в пути',
  [DocumentType.MULTIPOLIS]: 'Пакет Мультиполис',
  [DocumentType.COMMITMENT_STATEMENT]: 'Заявление-обязательство',
}

export const UPLOADED_FILE_NAME_MAP: Partial<Record<DocumentType, string>> = {
  [DocumentType.CONSENT_FORM]: 'Универсальная анкета',
  [DocumentType.TWO_NDFL]: 'Справка 2НДФЛ',
  [DocumentType.TAX_DECLARATION]: 'Справка 3НДФЛ',
  [DocumentType.CERTIFICATE_FREE_FORM]: 'Выписка из банка',
  [DocumentType.DRIVER_LICENSE]: 'Водительское удостоверение',
  [DocumentType.COMMITMENT_STATEMENT]: 'Заявление на ГП',
  [DocumentType.PASSPORT_PAGE_WITH_CHILDREN]: 'Информация о детях',
  [DocumentType.BIRTH_CERTIFICATE_OF_CHILD]: 'Свид. о рождении ребенка',
  [DocumentType.CERTIFICATE_OF_ADOPTION]: 'Свид. об усыновлении ребенка',
  [DocumentType.MEDICAL_LICENSE]: 'Лицензия мед. учреждения',
  [DocumentType.CERTIFICATE_FROM_WORK]: 'Справка с места работы',
  [DocumentType.COPY_WORK_BOOK]: 'Трудовая книжка',
  [DocumentType.LICENSE_OF_MUNICIPAL_INSTITUTION]: 'Лицензия образовательного учреждения',
  [DocumentType.COPY_OF_PTS]: 'ПТС / ЭПТС',
  [DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_WITH_CONDITIONS]: 'ДКП с учетом ГП',
  [DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_FOR_DEALER]: 'ДКП дилера',
  [DocumentType.CERTIFICATES_OF_DISABILITY]: 'Справка об инвалидности',
  [DocumentType.COPY_OF_MILITARY_TICKET]: 'Военный билет',
  [DocumentType.COPY_OF_ORDER_ON_CALL]: 'Удостоверения военнослужащего',
  [DocumentType.CERTIFICATION_ON_MILITARY_SERVICE]: 'Прохождение военной службы',
  [DocumentType.MILITARY_TICKET_AND_NOTICE_DISTRIBUTION_POINT]: 'Военный билет + повестка',
  [DocumentType.COPY_OF_MILITARY_SERVICE]: 'Контракт ВС РФ ',
  [DocumentType.COPY_CONTRACT_ON_VOLUNTARY_ASSISTANCE]: 'Контракт добровольца',
  [DocumentType.COPY_OF_CERTIFICATE_OF_MARRIAGE_TO_MILITARY]: 'Свидетельство о браке',
  [DocumentType.COPY_ADOPTION_CERTIFICATE_BY_MILITARY]: 'Свид. об усыновления заемщика',
  [DocumentType.COPY_OF_BIRTH_CERTIFICATE_OF_MILITARY_CHILD]: 'Свид. о рождении заемщика',
  [DocumentType.COPY_OF_MILITARY_ADOPTION_CERTIFICATE]: 'Свид. об усыновлении военнослужащего',
  [DocumentType.DOCUMENT_CONFIRMING_CHANGE_FIO]: 'Документ о смене ФИО',
  [DocumentType.DOCUMENTS_CONFIRMING_CONDITIONS_OF_RESIDENCE]: 'Подтверждение совместного проживания',
  [DocumentType.COPY_OF_PENSION_AND_MILITARY_TICKET]: 'Пенсионное удостоверение',
  [DocumentType.COPY_OF_PASSPORT_WITH_REGISTRATION_DFO]: 'Прописка ДФО',
  [DocumentType.COPY_OF_CERTIFICATE_REGISTRATION_DFO]: 'Свидетельство о регистрации ДФО',
}
