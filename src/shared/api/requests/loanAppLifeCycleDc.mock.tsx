import {
  ApplicationFrontdc as ApplicationFrontdcProto,
  ApplicantFrontdc as ApplicantFrontdcProto,
  GetFullApplicationResponse as GetFullApplicationResponseProto,
  IncomeFrontdc as IncomeFrontdcProto,
  LoanDataFrontdc as LoanDataFrontdcProto,
  AdditionalOptionFrontdc as AdditionalOptionFrontdcProto,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'

//TODO перенести эти справочники в контракты DCB-390
export enum ApplicantDocsType {
  InternationalPassport = 2,
  MilitaryID = 3,
  OfficerID = 4,
  SailorPassport = 5,
  TemporaryCertificate2P = 7,
  InternationalPassportForRFCitizens = 11,
  BirthCertificate = 12,
  DiplomaticPassport = 13,
  USSRPassport = 14,
  DriverLicense = 15,
  ResidentCard = 17,
  PensionCertificate = 18,
  FederalEmployeeID = 19,
  soldierID = 20,
  Passport = 21,
  IdentityServiceCard = 22,
  StudentID = 23,
}

//TODO перенести эти справочники в контракты DCB-390
export enum AddressType {
  Permanent = 1,
  Actual = 2,
  Temporary = 3,
  Workplace = 4,
}

//TODO перенести эти справочники в контракты DCB-390
export enum PhoneType {
  Mobile = 1,
  PermanentHome = 2,
  ActualHome = 3,
  Work = 4,
  Additional = 4,
}

//TODO перенести эти справочники в контракты DCB-390
export enum IncomeDocumentType {
  NDFL2 = 3,
  TaxDeclaration = 4,
  EmploymentHistory = 5,
  FreeFormCertificate = 6,
}

//TODO перенести эти справочники в контракты DCB-390
export enum MaritalStatus {
  Married = 1,
  Single = 2,
  Divorced = 3,
  Widower = 4,
  CivilMarriage = 5,
}

//TODO перенести эти справочники в контракты DCB-390
export enum Occupation {
  TemporaryContract = 1,
  PermanentContract = 2,
  PrivatePractice = 3,
  IndividualEntrepreneur = 4,
  CommissionAgent = 5,
  Pensioner = 6,
  LawContractExecutor = 7,
  WithoutWork = 8,
  SelfEmployed = 9,
}

export interface IncomeFrontdc extends Omit<IncomeFrontdcProto, 'proofOfIncomePapersType'> {
  incomeDocumentType?: number
}

/* TODO Прослойка добалена, потому что сейчас в протосах ручки getFullApplication type: string,
а должен быть number */
export interface ApplicantFrontdc extends Omit<ApplicantFrontdcProto, 'category' | 'income'> {
  category?: number
  income?: IncomeFrontdc | null
}

export interface AdditionalOptionFrontdc extends Omit<AdditionalOptionFrontdcProto, 'docType'> {
  docType?: number
}

export interface LoanDataFrontdc extends Omit<LoanDataFrontdcProto, 'additionalOptions'> {
  additionalOptions?: AdditionalOptionFrontdc[] | null
}

export interface ApplicationFrontdc extends Omit<ApplicationFrontdcProto, 'applicant' | 'loanData'> {
  status: StatusCode
  applicant?: ApplicantFrontdc | null
  loanData?: LoanDataFrontdc | null
  createdDate?: string
}

export interface GetFullApplicationResponse extends Omit<GetFullApplicationResponseProto, 'application'> {
  application?: ApplicationFrontdc | null
}

export const fullApplicationData: GetFullApplicationResponse = {
  application: {
    status: StatusCode.FINALLY_APPROVED,
    appType: 2,
    dcAppId: '544545',
    createdDate: '2023-06-08T07:44:00.355Z',
    applicant: {
      type: 'MainDebitor',
      category: 0,
      lastName: 'Иванов',
      firstName: 'Иван',
      middleName: 'Иванович',
      prevLastName: 'Иванова',
      prevFirstName: 'Ивана',
      prevMiddleName: 'Ивановна',
      birthDate: '2000-01-01',
      birthPlace: 'Саратов',
      // sex?: number,
      // citizenship?: string,
      email: 'mail@mail.ru',
      marital: 1,
      children: 5,
      publicPerson: true,
      documents: [
        {
          type: 21,
          series: '1234',
          number: '123456',
          issuedBy: 'МВД',
          issuedCode: '123-456',
          issuedDate: '2023-12-15',
        },
        {
          type: 15,
          series: '1234',
          number: '123456',
          issuedBy: 'МВД',
          issuedCode: '123-456',
          issuedDate: '2023-12-15',
        },
      ],
      phones: [
        {
          type: 1,
          countryPrefix: '7',
          prefix: '903',
          number: '3800013',
        },
        {
          type: 4,
          countryPrefix: '7',
          prefix: '903',
          number: '3800013',
        },
      ],
      addresses: [
        {
          type: 1,
          country: 'Россия',
          postalCode: '410055',
          regCode: '77',
          region: 'Москва',
          areaType: '55',
          area: 'Усть-Курдюмский',
          cityType: '77',
          city: 'Москва',
          settlementType: '45',
          settlement: 'Курдюм',
          streetType: '34',
          street: 'Севастопольская',
          house: '17',
          houseExt: '5',
          unit: 'ж',
          unitNum: '174',
          office: '15',
        },
        {
          type: 2,
          country: 'Россия',
          postalCode: '410055',
          regCode: '77',
          region: 'Москва',
          areaType: '55',
          area: 'Усть-Курдюмский',
          cityType: '77',
          city: 'Москва',
          settlementType: '45',
          settlement: 'Курдюм',
          streetType: '34',
          street: 'Севастопольская',
          house: '17',
          houseExt: '5',
          unit: 'ж',
          unitNum: '174',
          office: '15',
        },
        {
          type: 4,
          country: 'Россия',
          postalCode: '410055',
          regCode: '77',
          region: 'Москва',
          areaType: '55',
          area: 'Усть-Курдюмский',
          cityType: '77',
          city: 'Москва',
          settlementType: '45',
          settlement: 'Курдюм',
          streetType: '34',
          street: 'Севастопольская',
          house: '17',
          houseExt: '5',
          unit: 'ж',
          unitNum: '174',
          office: '15',
        },
      ],
      employment: {
        occupation: 2,
        currentWorkExperience: 21,
        orgName: 'ДрайвКликБанк',
        inn: '123123123',
      },
      income: {
        incomeVerify: false,
        incomeDocumentType: 3,
        basicIncome: 1000.45,
        addIncome: 1000.47,
        // acceptedIncome?: number,
        familyIncome: 44000.82,
        expenses: 12005.2,
      },
    },
    loanCar: {
      isCarNew: true,
      autoCreateYear: 2021,
      mileage: '9',
      brand: 'Skoda',
      model: 'Octavia',
      autoPrice: 1345333.54,
      // vinNumber: '12341234123412341',
      carBody: '12341234123412341', // номер кузова
      // ptsNumber: '123123412341234',
      ptsNumber: '12ФЫ123456',
      ptsDate: '2021-05-10',
      dkpNumber: 'DC32567',
      dkpDate: '2021-05-10',
    },
    loanData: {
      productFamilyCode: '012',
      productId: '499fa8d7-fe66-4898-829d-8364f3e22bb1',
      productCode: 3,
      productName: 'Купи сейчас плати потом',
      downPayment: 410000,
      term: 36,
      monthlyPayment: 32000,
      dateStart: '2000-01-01',
      dateEnd: '2099-01-01',
      crMinValue: 100000,
      crMaxValue: 12000000,
      productMinDuration: 12,
      productMaxDuration: 48,
      npllzp: 3223.2,
      npllzak: 10000.99,
      approvalValidity: 45,
      cascoFlag: false,
      termsLoanCode: 2,
      productRates: {
        baseRate: 7.55,
        baseRateNew: 2.55,
        baseRateOld: 5.55,
        rateGrntyPeriod: '2',
        rateNewGrnty: 54.55,
        rateOldGrnty: 2.55,
        rateNonGrnty: 7.55,
        rateDiscountCpi: 1.35,
        // rateChangeCasco?: number,
      },
      incomeFlag: true,
      creditAmount: 12121.33,
      creditAmountWithoutAdd: 3242.2342,
      additionalOptions: [
        {
          type: 2,
          name: 'Ароматная елочка',
          vendor: 'Arex',
          broker: '343432323',
          inCreditFlag: true,
          inServicePackageFlag: false,
          price: 20,
          tariff: 'string',
          term: 36,
          bankOptionType: 2,
          cascoType: false,
          franchise: false,
          cascoLimit: 0,
          minDateOfBirth: '2000-01-01',
          minDriveExp: 5,
          docType: 2,
          certNumber: 'ув3а3а3а3м3',
          docNumber: '32ук23к22',
          docDate: '2023-04-23',
          dateStart: '2020-04-23',
          dateEnd: '2025-04-23',
          vendorAccount: {
            idAccount: 'fn39h4f93fuj340fj30j',
            accountNumber: '12345678901234567890',
            accountCorrNumber: '12345678901234567899',
            tax: 13.5,
            inn: '12345678901',
            kpp: '12345678',
            ogrn: '1234567890123',
            bank: 'Росбанк',
            bic: '12345678',
            address: 'Г Москва ул. Собаки баскервилей д7',
            accManualEnter: false,
          },
          brokerAccount: {
            idAccount: 'fn39h4f93fuj340fj30j',
            accountNumber: '12345678901234567890',
            accountCorrNumber: '12345678901234567899',
            tax: 13.5,
            inn: '12345678901',
            kpp: '12345678',
            ogrn: '1234567890123',
            bank: 'Росбанк',
            bic: '12345678',
            address: 'Г Москва ул. Собаки баскервилей д7',
            accManualEnter: false,
          },
        },
        {
          type: 1,
          name: 'ОСАГО',
          vendor: 'РосГосСтрах',
          broker: '043432323',
          inCreditFlag: true,
          inServicePackageFlag: false,
          price: 21,
          tariff: 'string',
          term: 24,
          bankOptionType: 1,
          cascoType: false,
          franchise: false,
          cascoLimit: 0,
          minDateOfBirth: '2011-01-01',
          minDriveExp: 4,
          docType: 2,
          certNumber: 'ув3а3а3а3м3',
          docNumber: '32ук23к22',
          docDate: '2023-04-23',
          dateStart: '2020-04-23',
          dateEnd: '2025-04-23',
          vendorAccount: {
            idAccount: 'fn39h4f93fuj340fj30j',
            accountNumber: '12345678901234567890',
            accountCorrNumber: '12345678901234567891',
            tax: 13.5,
            inn: '12345678901',
            kpp: '12345678',
            ogrn: '1234567890123',
            bank: 'Росбанк',
            bic: '12345678',
            address: 'Г Москва ул. Собаки баскервилей д7',
            accManualEnter: false,
          },
          brokerAccount: {
            idAccount: 'fn39h4f93fuj340fj30j',
            accountNumber: '12345678901234567890',
            accountCorrNumber: '12345678901234567891',
            tax: 13.5,
            inn: '12345678901',
            kpp: '12345678',
            ogrn: '1234567890123',
            bank: 'Росбанк',
            bic: '12345678',
            address: 'Г Москва ул. Собаки баскервилей д7',
            accManualEnter: false,
          },
        },
      ],
    },
    vendor: {
      vendorCode: '2002703288',
      vendorName: 'Сармат',
      vendorType: true,
      accManualEnter: false,
      vendorRegion: '77',
      riskCode: '202/e',
      netCode: '200223',
      address: 'Г Счастья ул радости дом 7',
      vendorBankDetails: {
        idAccount: 'fn39h4f93fuj340fj30j',
        accountNumber: '40702810038000017240',
        accountCorrNumber: '12345678901234567890',
        tax: 11.1,
        inn: '12345678901',
        kpp: '12345678',
        ogrn: '1234567890123456789011',
        bic: '12345678',
        bank: 'Сбербанк',
      },
    },
    specialMark: 'Находится в нетрезвом состоянии',
  },
}
