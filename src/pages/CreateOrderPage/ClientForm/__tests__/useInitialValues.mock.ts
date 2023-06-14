export const EXPECTED_DATA = {
  clientName: 'Иванов Иван Иванович',
  hasNameChanged: true,
  clientFormerName: 'Иванова Ивана Ивановна',
  numOfChildren: '5',
  familyStatus: 1,
  passport: '12 34 123456',
  birthDate: new Date('2000-01-01T00:00:00.000Z'),
  birthPlace: 'Саратов',
  passportDate: new Date('2023-12-15T00:00:00.000Z'),
  divisionCode: '123-456',
  issuedBy: 'МВД',
  registrationAddressString:
    'Москва, Усть-Курдюмский, 55, Москва, 77, 45, Курдюм, 34, Севастопольская, 17, ж, 5, 174',
  registrationAddress: {
    region: 'Москва',
    area: 'Усть-Курдюмский',
    city: 'Москва',
    settlementType: '45',
    settlement: 'Курдюм',
    streetType: '34',
    areaType: '55',
    cityType: '77',
    street: 'Севастопольская',
    house: '17',
    unit: 'ж',
    houseExt: '5',
    unitNum: '174',
  },
  regNotKladr: false,
  regAddrIsLivingAddr: true,
  livingAddressString:
    'Москва, Усть-Курдюмский, 55, Москва, 77, 45, Курдюм, 34, Севастопольская, 17, ж, 5, 174',
  livingAddress: {
    region: 'Москва',
    area: 'Усть-Курдюмский',
    city: 'Москва',
    settlementType: '45',
    areaType: '55',
    cityType: '77',
    settlement: 'Курдюм',
    streetType: '34',
    street: 'Севастопольская',
    house: '17',
    unit: 'ж',
    houseExt: '5',
    unitNum: '174',
  },
  livingNotKladr: false,
  mobileNumber: '79033800013',
  additionalNumber: '79033800013',
  email: 'mail@mail.ru',
  averageIncome: '1000.45',
  additionalIncome: '1000.47',
  incomeConfirmation: true,
  familyIncome: '44000.82',
  expenses: '12005.2',
  relatedToPublic: 1,
  ndfl2File: null,
  ndfl3File: null,
  bankStatementFile: null,
  incomeProofUploadValidator: '',
  secondDocumentType: 15,
  secondDocumentNumber: '1234123456',
  secondDocumentDate: new Date('2023-12-15T00:00:00.000Z'),
  secondDocumentIssuedBy: 'МВД',
  occupation: 2,
  employmentDate: new Date('2021-09-08T07:44:00.355Z'),
  employerName: 'ДрайвКликБанк',
  employerPhone: '79033800013',
  employerAddress: {
    region: 'Москва',
    area: 'Усть-Курдюмский',
    city: 'Москва',
    settlementType: '45',
    areaType: '55',
    cityType: '77',
    settlement: 'Курдюм',
    streetType: '34',
    street: 'Севастопольская',
    house: '17',
    unit: 'ж',
    houseExt: '5',
    unitNum: '174',
  },
  employerAddressString:
    'Москва, Усть-Курдюмский, 55, Москва, 77, 45, Курдюм, 34, Севастопольская, 17, ж, 5, 174',
  emplNotKladr: false,
  employerInn: '123123123',
  specialMark: 'Находится в нетрезвом состоянии',
  questionnaireFile: null,
}
