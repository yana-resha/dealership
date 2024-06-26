import { prepareEmails } from '../useGetEmailsQuery'
import { mockedEmails, mockedPreparedEmails } from './useGetEmailsQuery.mock'

describe('prepareEmails', () => {
  it('Фильтрация и маппинг писем работают корректно', () => {
    expect(prepareEmails(mockedEmails)).toEqual(mockedPreparedEmails)
  })
})
