export interface Address {
  postalCode: string
  regCode: string | null
  region: string
  area: string
  areaType: string | null
  city: string
  cityType: string | null
  settlementType: string | null
  /** Населенный пункт */
  settlement: string
  streetType: string | null
  street: string
  house: string
  /** Строение */
  unit: string
  /** Корпус */
  houseExt: string
  /** Квартира/ офис */
  unitNum: string
}
// Тип save используется при нажатии на кнопку Отправить
// Тип draft используется при нажатии на кнопку Сохранить черновик
// Тип save используется при нажатии на Распечатать
// Нажатие на любую из кнопок должно запускать валидацию, и дальнейшие различные друг от друга действия.
// Потому эти типы вообще и нужны
export enum SubmitAction {
  Save = 'save',
  Draft = 'draft',
  Print = 'print',
}

export interface ClientData {
  clientName: string
  hasNameChanged: boolean
  clientFormerName: string
  numOfChildren: string
  familyStatus: number | null
  passport: string
  birthDate: Date | null
  birthPlace: string
  passportDate: Date | null
  sex: number | null
  divisionCode: string
  issuedBy: string
  registrationAddressString: string
  registrationAddress: Address
  regNotKladr: boolean
  regAddrIsLivingAddr: boolean
  livingAddressString: string
  livingAddress: Address
  livingNotKladr: boolean
  mobileNumber: string
  additionalNumber: string
  email: string
  averageIncome: string
  additionalIncome: string
  incomeConfirmation: boolean
  familyIncome: string
  expenses: string
  relatedToPublic: number | null
  ndfl2File: File | null
  ndfl3File: File | null
  bankStatementFile: File | null
  incomeProofUploadValidator: string
  secondDocumentType: number | null
  secondDocumentNumber: string
  secondDocumentDate: Date | null
  secondDocumentIssuedBy: string
  occupation: number | null
  employmentDate: Date | null
  employerName: string | null
  employerPhone: string
  employerAddress: Address
  employerAddressString: string
  emplNotKladr: boolean
  employerInn: string
  specialMark: string
  questionnaireFile: File | null
  submitAction: SubmitAction
}
