import { PreparedTableData } from 'entities/application/ApplicationTable/ApplicationTable.types'

export const formFields = ['Серия и номер паспорта', 'ФИО', 'День рождения', 'Телефон']

export const initialData = {
  passportSeries: '1234',
  passportNumber: '123123',
  firstName: 'Иван',
  middleName: 'Иванович',
  lastName: 'Иванов',
  birthDate: '1999-01-31',
  phoneNumber: '89001231234',
}

export const formData = {
  passport: '1234123123',
  clientName: 'Иванов Иван Иванович',
  birthDate: new Date('1999-01-31'),
  phoneNumber: '001231234',
}

export const applicationTabledataMock: PreparedTableData[] = [
  {
    applicationNumber: '1',
    applicationUpdateDate: '22.02.2023',
    decisionTerm: '10',
    fullName: 'Терентьев Михаил Павлович',
    isDC: true,
    source: 'Сбол',
    status: 0,
    vendorCode: '2003023272',
  },
]
