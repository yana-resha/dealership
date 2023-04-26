export interface ClientData {
  clientName: string
  hasNameChanged: number
  clientFormerName: string
  numOfChildren: string
  familyStatus: string
  passport: string
  birthDate: Date | null
  birthPlace: string
  passportDate: Date | null
  divisionCode: string
  issuedBy: string
  registrationAddress: string
  regNotKladr: number
  regAddrIsLivingAddr: number
  livingAddress: string
  livingNotKladr: number
  regDate: Date | null
  phoneType: string
  phoneNumber: string
  email: string
  averageIncome: string
  additionalIncome: string
  incomeConfirmed: number
  familyIncome: string
  expenses: string
  relatedToPublic: string
  ndfl2: number
  ndfl3: number
  extracts: number
  secondDocumentType: string
  secondDocumentNumber: string
  secondDocumentDate: Date | null
  secondDocumentIssuedBy: string
  occupation: string
  employmentDate: Date | null
  employerName: string
  employerPhone: string
  employerAddress: string
  employerInn: string
  contractType: string
  anketaSigned: number
}

export const configInitialValues: ClientData = {
  clientName: '',
  hasNameChanged: 0,
  clientFormerName: '',
  numOfChildren: '',
  familyStatus: '',
  passport: '',
  birthDate: null,
  birthPlace: '',
  passportDate: null,
  divisionCode: '',
  issuedBy: '',
  registrationAddress: '',
  regNotKladr: 0,
  regAddrIsLivingAddr: 0,
  livingAddress: '',
  livingNotKladr: 0,
  regDate: null,
  phoneType: '',
  phoneNumber: '',
  email: '',
  averageIncome: '',
  additionalIncome: '',
  incomeConfirmed: 0,
  familyIncome: '',
  expenses: '',
  relatedToPublic: '',
  ndfl2: 0,
  ndfl3: 0,
  extracts: 0,
  secondDocumentType: '',
  secondDocumentNumber: '',
  secondDocumentDate: null,
  secondDocumentIssuedBy: '',
  occupation: '',
  employmentDate: null,
  employerName: '',
  employerPhone: '',
  employerAddress: '',
  employerInn: '',
  contractType: '',
  anketaSigned: 0,
}
