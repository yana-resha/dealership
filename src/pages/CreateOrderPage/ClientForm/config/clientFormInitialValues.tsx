import {
  ApplicantDocsType,
  MaritalStatus,
  OccupationType,
  Sex,
  DocumentType,
} from '@sberauto/loanapplifecycledc-proto/public'

import { UploaderConfig } from 'features/ApplicationFileLoader'

import { Address, ClientData, SubmitAction } from '../ClientForm.types'

export const configAddressInitialValues: Address = {
  postalCode: '',
  regCode: null,
  region: '',
  areaType: null,
  area: '',
  cityType: null,
  city: '',
  settlementType: null,
  settlement: '',
  streetType: null,
  street: '',
  house: '',
  unit: '',
  houseExt: '',
  unitNum: '',
}

export const configInitialValues: ClientData = {
  clientName: '',
  hasNameChanged: false,
  clientFormerName: '',
  numOfChildren: '',
  familyStatus: null,
  passport: '',
  birthDate: null,
  birthPlace: '',
  passportDate: null,
  divisionCode: '',
  sex: null,
  issuedBy: '',
  registrationAddressString: '',
  registrationAddress: configAddressInitialValues,
  regNotKladr: false,
  regAddrIsLivingAddr: false,
  livingAddressString: '',
  livingAddress: configAddressInitialValues,
  livingNotKladr: false,
  mobileNumber: '',
  additionalNumber: '',
  email: '',
  averageIncome: '',
  additionalIncome: '',
  familyIncome: '',
  expenses: '',
  relatedToPublic: null,

  // Справки о доходах
  incomeConfirmation: false,
  ndfl2File: null,
  ndfl3File: null,
  bankStatementFile: null,
  incomeProofUploadValidator: '',

  secondDocumentType: null,
  secondDocumentNumber: '',
  secondDocumentDate: null,
  secondDocumentIssuedBy: '',
  occupation: null,
  employmentDate: null,
  employerName: '',
  employerPhone: '',
  employerAddress: configAddressInitialValues,
  employerAddressString: '',
  emplNotKladr: false,
  employerInn: '',
  questionnaireFile: null,
  submitAction: SubmitAction.Save,
  isFormComplete: false,
}

export const FAMILY_STATUS_VALUES = [
  { label: 'Женат/Замужем', value: MaritalStatus.MARRIED },
  { label: 'Холост/Не замужем', value: MaritalStatus.SINGLE },
  { label: 'Разведен/Разведена', value: MaritalStatus.DIVORCED },
  { label: 'Вдовец/Вдова', value: MaritalStatus.WIDOWER },
  { label: 'Гражданский брак', value: MaritalStatus.CIVILMARRIAGE },
]

export const SEX_VALUES = [
  { label: 'Мужской', value: Sex.MALE },
  { label: 'Женский', value: Sex.FEMALE },
]

export const OCCUPATION_VALUES = [
  { label: 'Работает/Служит по временному контракту', value: OccupationType.WORKING_ON_A_TEMPORARY_CONTRACT },
  {
    label: 'Работает/Служит по постоянному контракту',
    value: OccupationType.WORKING_ON_A_PERMANENT_CONTRACT,
  },
  { label: 'Частная практика', value: OccupationType.PRIVATE_PRACTICE },
  { label: 'Индивидуальный предприниматель', value: OccupationType.INDIVIDUAL_ENTREPRENEUR },
  { label: 'Агент на комиссионном договоре', value: OccupationType.AGENT_ON_COMMISSION_CONTRACT },
  { label: 'Пенсионер', value: OccupationType.PENSIONER },
  {
    label: 'Исполнитель по гражданско-правовому договору',
    value: OccupationType.CONTRACTOR_UNDER_CIVIL_LAW_CONTRACT,
  },
  { label: 'Не работает', value: OccupationType.UNEMPLOYED },
  { label: 'Самозанятый', value: OccupationType.SELF_EMPLOYED },
]

export const DOCUMENT_TYPE_VALUES = [
  {
    label: 'Заграничный паспорт (для граждан РФ для выезда за рубеж)',
    value: ApplicantDocsType.INTERNATIONALPASSPORTFORRFCITIZENS,
  },
  { label: 'Водительское удостоверение', value: ApplicantDocsType.DRIVERLICENSE },
  { label: 'Страховое свидетельство пенсионного страхования', value: ApplicantDocsType.PENSIONCERTIFICATE },
  { label: 'Инн', value: ApplicantDocsType.INN },
  // { label: 'Международный паспорт (для не граждан РФ)', value: ApplicantDocsType.InternationalPassport },
  // { label: 'Военный билет', value: ApplicantDocsType.MilitaryID },
  // { label: 'Удостоверение офицера', value: ApplicantDocsType.OfficerID },
  // { label: 'Паспорт моряка', value: ApplicantDocsType.SailorPassport },
  // { label: 'Временное удостоверение по форме № 2-П', value: ApplicantDocsType.TemporaryCertificate2P },
  // {
  //   label: 'Свидетельство о рождении (для граждан РФ, не достигших 14 лет)',
  //   value: ApplicantDocsType.BirthCertificate,
  // },
  // { label: 'Дипломатический паспорт гражданина РФ', value: ApplicantDocsType.DiplomaticPassport },
  // { label: 'Паспорт гражданина СССР', value: ApplicantDocsType.USSRPassport },
  // { label: 'Вид на жительство', value: ApplicantDocsType.ResidentCard },
  // {
  //   label: 'Удостоверение личности сотрудника федеральных органов власти',
  //   value: ApplicantDocsType.FederalEmployeeID,
  // },
  // { label: 'Удостоверение личности военнослужащего', value: ApplicantDocsType.soldierID },
  // { label: 'Паспорт РФ', value: ApplicantDocsType.Passport },
  // {
  //   label: 'Удостоверение личности/служебное удостоверение',
  //   value: ApplicantDocsType.IdentityServiceCard,
  // },
  // { label: 'Студенческий билет', value: ApplicantDocsType.StudentID },
]

type Documents = Omit<UploaderConfig, 'documentFile' | 'documentError'>
/** Мапа названия файла (название поля в форме) и его типа */
export const UPLOADED_DOCUMENTS = {
  ndfl2File: {
    documentLabel: '2НДФЛ',
    documentName: 'ndfl2File',
    documentType: DocumentType.TWO_NDFL,
  } as Documents,
  ndfl3File: {
    documentLabel: '3НДФЛ',
    documentName: 'ndfl3File',
    documentType: DocumentType.TAX_DECLARATION,
  } as Documents,
  bankStatementFile: {
    documentLabel: 'Выписка из банка',
    documentName: 'bankStatementFile',
    documentType: DocumentType.CERTIFICATE_FREE_FORM,
  } as Documents,
  questionnaireFile: {
    documentLabel: 'Подписанная анкета',
    documentName: 'questionnaireFile',
    documentType: DocumentType.CONSENT_FORM,
  },
} as const
