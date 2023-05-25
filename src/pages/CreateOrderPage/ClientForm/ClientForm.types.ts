export interface Address {
  region: string
  district: string
  city: string
  townType: string
  town: string
  streetType: string
  street: string
  house: string
  building: string
  block: string
  flat: string
}

export interface ClientData {
  clientName: string
  hasNameChanged: boolean
  clientFormerName: string
  numOfChildren: string
  familyStatus: string
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
  relatedToPublic: string
  ndfl2File: File | null
  ndfl3File: File | null
  bankStatementFile: File | null
  incomeProofUploadValidator: string
  secondDocumentType: string
  secondDocumentNumber: string
  secondDocumentDate: Date | null
  secondDocumentIssuedBy: string
  occupation: string
  employmentDate: Date | null
  employerName: string
  employerPhone: string
  employerAddress: Address
  employerAddressString: string
  emplNotKladr: boolean
  employerInn: string
  specialMarkReason: string
  specialMark: boolean
  questionnaireFile: File | null
}
