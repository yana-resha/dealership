export interface ClientData {
  clientName: string
  hasNameChanged: number
  clientFormerName: string
  numOfChildren: string
  familyStatus: string
  passport: string
  birthDate: Date | string
  birthPlace: string
  passportDate: Date | string
  divisionCode: string
  issuedBy: string
  registrationAddress: string
  regNotKladr: number
  regAddrIsLivingAddr: number
  livingAddress: string
  livingNotKladr: number
  regDate: Date | string
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
  secondDocumentDate: Date | string
  secondDocumentIssuedBy: string
  occupation: string
  employmentDate: Date | string
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
  birthDate: '',
  birthPlace: '',
  passportDate: '',
  divisionCode: '',
  issuedBy: '',
  registrationAddress: '',
  regNotKladr: 0,
  regAddrIsLivingAddr: 0,
  livingAddress: '',
  livingNotKladr: 0,
  regDate: '',
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
  secondDocumentDate: '',
  secondDocumentIssuedBy: '',
  occupation: '',
  employmentDate: '',
  employerName: '',
  employerPhone: '',
  employerAddress: '',
  employerInn: '',
  contractType: '',
  anketaSigned: 0,
}
