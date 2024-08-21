import { DocumentType, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

export const GOV_PROGRAM_DOCUMENT_NAMES_MAP: Partial<Record<DocumentType, string>> = {
  [DocumentType.COMMITMENT_STATEMENT]: 'Заявление-обязательство',
  [DocumentType.DRIVER_LICENSE]: 'Водительское удостоверение',
  [DocumentType.PASSPORT_PAGE_WITH_CHILDREN]:
    'Копия страницы паспорта родителя с отметкой о его (ее) несовершеннолетних детях',
  [DocumentType.BIRTH_CERTIFICATE_OF_CHILD]: 'Свидетельство о рождении несовершеннолетнего ребенка',
  [DocumentType.CERTIFICATE_OF_ADOPTION]:
    'Свидетельство об усыновлении (удочерении) или документ (удостоверение) о назначении опекуном (попечителем)',
  [DocumentType.MEDICAL_LICENSE]: 'Лицензия медицинского учреждения',
  [DocumentType.CERTIFICATE_FROM_WORK]: 'Справка с места работы (где указан номер лицензии)',
  [DocumentType.COPY_WORK_BOOK]: 'Копия трудовой книжки',
  [DocumentType.LICENSE_OF_MUNICIPAL_INSTITUTION]:
    'Лицензия государственного муниципального образовательного учреждения',
  [DocumentType.COPY_OF_PTS]: 'Скан-копия ПТС',
  [DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_WITH_CONDITIONS]:
    'Копия Договора купли-продажи с условием о зачете ТС в счет оплаты',
  [DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_FOR_DEALER]: 'Копия Договора купли-продажи ТС дилеру',
  [DocumentType.CERTIFICATES_OF_DISABILITY]: 'Справка об установлении инвалидности',
  [DocumentType.COPY_OF_MILITARY_TICKET]: 'Копия военного билета',
  [DocumentType.COPY_OF_ORDER_ON_CALL]: 'Копия приказа о призыве, удостоверение военнослужащего',
  [DocumentType.CERTIFICATION_ON_MILITARY_SERVICE]: 'Справка войсковой части о прохождении военной службы',
  [DocumentType.MILITARY_TICKET_AND_NOTICE_DISTRIBUTION_POINT]:
    'Военный билет вместе с повесткой о прибытии в распределительный пункт',
  [DocumentType.COPY_OF_MILITARY_SERVICE]: 'Копия контракта о прохождении военной службы',
  [DocumentType.COPY_CONTRACT_ON_VOLUNTARY_ASSISTANCE]:
    'Копия контракта о добровольном содействии в выполнении задач, возложенных на ВС РФ',
  [DocumentType.COPY_OF_CERTIFICATE_OF_MARRIAGE_TO_MILITARY]:
    'Копия свидетельства о заключении брака Заемщиком с Военнослужащим',
  [DocumentType.COPY_ADOPTION_CERTIFICATE_BY_MILITARY]:
    'Копия свидетельства об усыновлении/удочерении Заемщика Военнослужащим',
  [DocumentType.COPY_OF_BIRTH_CERTIFICATE_OF_MILITARY_CHILD]:
    'Копия свидетельства о рождении Заемщика, родителем которого является Военнослужащий',
  [DocumentType.COPY_OF_MILITARY_ADOPTION_CERTIFICATE]:
    'Копия свидетельства об усыновлении/удочерении Военнослужащего Заемщиком',
  [DocumentType.DOCUMENT_CONFIRMING_CHANGE_FIO]:
    'Документы, подтверждающие смену ФИО родственника/супруга (супруги) Военнослужащего',
  [DocumentType.DOCUMENTS_CONFIRMING_CONDITIONS_OF_RESIDENCE]:
    'Документы подтверждающие условие совместного проживания',
  [DocumentType.COPY_OF_PENSION_AND_MILITARY_TICKET]:
    'Копия пенсионного удостоверения+Копия военного билета с обязательным указанием военно-учетной специальности',
  [DocumentType.COPY_OF_PASSPORT_WITH_REGISTRATION_DFO]:
    'Копия страницы паспорта, подтверждающая регистрацию на территории Дальневосточного федерального округа',
  [DocumentType.COPY_OF_CERTIFICATE_REGISTRATION_DFO]:
    'Копия свидетельства о регистрации на территории Дальневосточного федерального округа',
}

export enum GovProgramCode {
  FIRST_CAR = '001',
  FAMILY_CAR = '002',
  EDUCATION_WORKER = '003',
  TRADE_IN = '004',
  MEDICAL_WORKER = '005',
  SOLDIER = '006',
  INVALID = '007',
  ELECTRIC_CAR = '008',
  MILITARY_PENSIONER = '009',
}

export const DEFAULT_GOV_PROGRAM_DOCUMENT_LABEL = 'Документ'

export const GOV_PROGRAM_DOCUMENT_LABELS = [
  'Первый документ',
  'Второй документ',
  'Третий документ',
  'Четвертый документ',
  'Пятый документ',
]

/* Мапа с документами для госпрограм. Ключи - коды госпрограмм. documents - перечень уровней прилагаемых
документов (1-й, 2-ой...). На каждом уровне может быть один документ, либо несколько документов,
тогда документы будут перечислены в виде массива. dfoDocuments - перечень документов для ДФО,
если такой флаг включен. Логика с уровнями в dfoDocuments аналогична documents. */
export const GOV_PROGRAM_DOCUMENTS_MAP = {
  [GovProgramCode.FIRST_CAR]: {
    documents: [DocumentType.COMMITMENT_STATEMENT, DocumentType.DRIVER_LICENSE],
    dfoDocuments: [],
  },
  [GovProgramCode.FAMILY_CAR]: {
    documents: [
      DocumentType.COMMITMENT_STATEMENT,
      DocumentType.DRIVER_LICENSE,
      [
        DocumentType.PASSPORT_PAGE_WITH_CHILDREN,
        DocumentType.BIRTH_CERTIFICATE_OF_CHILD,
        DocumentType.CERTIFICATE_OF_ADOPTION,
      ],
    ],
    dfoDocuments: [
      [
        DocumentType.COPY_OF_PASSPORT_WITH_REGISTRATION_DFO,
        DocumentType.COPY_OF_CERTIFICATE_REGISTRATION_DFO,
      ],
    ],
  },
  [GovProgramCode.EDUCATION_WORKER]: {
    documents: [
      DocumentType.COMMITMENT_STATEMENT,
      DocumentType.DRIVER_LICENSE,
      [DocumentType.CERTIFICATE_FROM_WORK, DocumentType.LICENSE_OF_MUNICIPAL_INSTITUTION],
      DocumentType.COPY_WORK_BOOK,
    ],
    dfoDocuments: [],
  },
  [GovProgramCode.TRADE_IN]: {
    documents: [
      DocumentType.COMMITMENT_STATEMENT,
      DocumentType.DRIVER_LICENSE,
      DocumentType.COPY_OF_PTS,
      [
        DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_WITH_CONDITIONS,
        DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_FOR_DEALER,
      ],
    ],
    dfoDocuments: [],
  },
  [GovProgramCode.MEDICAL_WORKER]: {
    documents: [
      DocumentType.COMMITMENT_STATEMENT,
      DocumentType.DRIVER_LICENSE,
      [DocumentType.MEDICAL_LICENSE, DocumentType.CERTIFICATE_FROM_WORK],
      DocumentType.COPY_WORK_BOOK,
    ],
    dfoDocuments: [],
  },
  [GovProgramCode.SOLDIER]: {
    documents: [
      DocumentType.COMMITMENT_STATEMENT,
      DocumentType.DRIVER_LICENSE,
      [
        DocumentType.COPY_OF_MILITARY_TICKET,
        DocumentType.COPY_OF_ORDER_ON_CALL,
        DocumentType.CERTIFICATION_ON_MILITARY_SERVICE,
        DocumentType.MILITARY_TICKET_AND_NOTICE_DISTRIBUTION_POINT,
        DocumentType.COPY_OF_MILITARY_SERVICE,
        DocumentType.COPY_CONTRACT_ON_VOLUNTARY_ASSISTANCE,
      ],
      [
        DocumentType.COPY_OF_CERTIFICATE_OF_MARRIAGE_TO_MILITARY,
        DocumentType.COPY_ADOPTION_CERTIFICATE_BY_MILITARY,
        DocumentType.COPY_OF_BIRTH_CERTIFICATE_OF_MILITARY_CHILD,
        DocumentType.COPY_OF_MILITARY_ADOPTION_CERTIFICATE,
        DocumentType.DOCUMENT_CONFIRMING_CHANGE_FIO,
        DocumentType.DOCUMENTS_CONFIRMING_CONDITIONS_OF_RESIDENCE,
      ],
    ],
    dfoDocuments: [],
  },
  [GovProgramCode.INVALID]: {
    documents: [
      DocumentType.COMMITMENT_STATEMENT,
      DocumentType.DRIVER_LICENSE,
      DocumentType.CERTIFICATES_OF_DISABILITY,
    ],
    dfoDocuments: [],
  },
  [GovProgramCode.ELECTRIC_CAR]: {
    documents: [DocumentType.COMMITMENT_STATEMENT, DocumentType.DRIVER_LICENSE],
    dfoDocuments: [],
  },
  [GovProgramCode.MILITARY_PENSIONER]: {
    documents: [
      DocumentType.COMMITMENT_STATEMENT,
      DocumentType.DRIVER_LICENSE,
      DocumentType.COPY_OF_MILITARY_TICKET,
      DocumentType.COPY_OF_PENSION_AND_MILITARY_TICKET,
    ],
    dfoDocuments: [],
  },
}

export const GOV_PROGRAM_DOCUMENT_TYPES: DocumentType[] = [
  DocumentType.DRIVER_LICENSE,
  DocumentType.COMMITMENT_STATEMENT,
  DocumentType.PASSPORT_PAGE_WITH_CHILDREN,
  DocumentType.BIRTH_CERTIFICATE_OF_CHILD,
  DocumentType.CERTIFICATE_OF_ADOPTION,
  DocumentType.MEDICAL_LICENSE,
  DocumentType.CERTIFICATE_FROM_WORK,
  DocumentType.COPY_WORK_BOOK,
  DocumentType.LICENSE_OF_MUNICIPAL_INSTITUTION,
  DocumentType.COPY_OF_PTS,
  DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_WITH_CONDITIONS,
  DocumentType.COPY_OF_THE_PURCHASE_SALE_AGREEMENT_FOR_DEALER,
  DocumentType.CERTIFICATES_OF_DISABILITY,
  DocumentType.COPY_OF_MILITARY_TICKET,
  DocumentType.COPY_OF_ORDER_ON_CALL,
  DocumentType.CERTIFICATION_ON_MILITARY_SERVICE,
  DocumentType.MILITARY_TICKET_AND_NOTICE_DISTRIBUTION_POINT,
  DocumentType.COPY_OF_MILITARY_SERVICE,
  DocumentType.COPY_CONTRACT_ON_VOLUNTARY_ASSISTANCE,
  DocumentType.COPY_OF_CERTIFICATE_OF_MARRIAGE_TO_MILITARY,
  DocumentType.COPY_ADOPTION_CERTIFICATE_BY_MILITARY,
  DocumentType.COPY_OF_BIRTH_CERTIFICATE_OF_MILITARY_CHILD,
  DocumentType.COPY_OF_MILITARY_ADOPTION_CERTIFICATE,
  DocumentType.DOCUMENT_CONFIRMING_CHANGE_FIO,
  DocumentType.DOCUMENTS_CONFIRMING_CONDITIONS_OF_RESIDENCE,
  DocumentType.COPY_OF_PENSION_AND_MILITARY_TICKET,
  DocumentType.COPY_OF_PASSPORT_WITH_REGISTRATION_DFO,
  DocumentType.COPY_OF_CERTIFICATE_REGISTRATION_DFO,
]
