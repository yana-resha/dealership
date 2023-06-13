export interface Address {
  region: string
  area: string
  areaType: string
  city: string
  cityType: string
  settlementType: string
  /** Населенный пункт */
  settlement: string
  streetType: string
  street: string
  house: string
  /** Строение */
  unit: string
  /** Корпус */
  houseExt: string
  /** Квартира/ офис */
  unitNum: string
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
  employerName: string
  employerPhone: string
  employerAddress: Address
  employerAddressString: string
  emplNotKladr: boolean
  employerInn: string
  specialMark: string
  questionnaireFile: File | null
}
