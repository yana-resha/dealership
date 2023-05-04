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

export const configAddressInitialValues: Address = {
  region: '',
  district: '',
  city: '',
  townType: '',
  town: '',
  streetType: '',
  street: '',
  house: '',
  building: '',
  block: '',
  flat: '',
}

export const configInitialValues: ClientData = {
  clientName: 'Терентьев Михаил Павлович',
  hasNameChanged: false,
  clientFormerName: '',
  numOfChildren: '',
  familyStatus: '',
  passport: '1234 567890',
  birthDate: new Date(1985, 0, 20, 0, 0, 0, 0),
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
  mobileNumber: '89005553535',
  additionalNumber: '',
  email: '',
  averageIncome: '',
  additionalIncome: '',
  incomeConfirmation: false,
  familyIncome: '',
  expenses: '',
  relatedToPublic: '',
  ndfl2File: null,
  ndfl3File: null,
  bankStatementFile: null,
  incomeProofUploadValidator: '',
  secondDocumentType: '',
  secondDocumentNumber: '',
  secondDocumentDate: null,
  secondDocumentIssuedBy: '',
  occupation: '',
  employmentDate: null,
  employerName: '',
  employerPhone: '',
  employerAddress: configAddressInitialValues,
  employerAddressString: '',
  emplNotKladr: false,
  employerInn: '',
  specialMarkReason: '',
  specialMark: false,
  questionnaireFile: null,
}
