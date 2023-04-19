import { GetUserResponse } from '@sberauto/authdc-proto/public'

//TODO DCB-126: Убрать мок после интеграции
export function mockGetUserResponse(): GetUserResponse {
  return {
    login: 'johndoe',
    employeeId: '123456',
    lastName: 'Doe',
    firstName: 'John',
    phone: '+1 123-456-7890',
    email: 'johndoe@example.com',
    birthDate: '1990-01-01',
  }
}
