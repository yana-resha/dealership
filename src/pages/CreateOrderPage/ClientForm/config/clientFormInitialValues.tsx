import { ApplicantDocsType, OccupationType } from '@sberauto/loanapplifecycledc-proto/public'

import { MaritalStatus } from 'shared/api/requests/loanAppLifeCycleDc.mock'

import { Address, ClientData, SubmitAction } from '../ClientForm.types'

export const configAddressInitialValues: Address = {
  region: '',
  areaType: '',
  area: '',
  cityType: '',
  city: '',
  settlementType: '',
  settlement: '',
  streetType: '',
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
  incomeConfirmation: false,
  familyIncome: '',
  expenses: '',
  relatedToPublic: null,
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
  specialMark: '',
  questionnaireFile: null,
  submitAction: SubmitAction.Save,
}

export const FAMILY_STATUS_VALUES = [
  { label: 'Женат/Замужем', value: MaritalStatus.Married },
  { label: 'Холост/Не замужем', value: MaritalStatus.Single },
  { label: 'Разведен/Разведена', value: MaritalStatus.Divorced },
  { label: 'Вдовец/Вдова', value: MaritalStatus.Widower },
  { label: 'Гражданский брак', value: MaritalStatus.CivilMarriage },
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
