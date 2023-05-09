import { FullOrderCalculator } from 'common/FullOrderCalculator'
import { BankOffers } from 'entities/BankOffers'

import { dataMock } from './__tests__/FullOrderSettings.test.mock'

export function FullOrderSettings() {
  return (
    <>
      <FullOrderCalculator
        onSubmit={() => console.log('FullOrderCalculator')}
        onChangeForm={() => console.log('clearBankOfferList')}
      />
      <BankOffers data={dataMock} onRowClick={() => null} />
    </>
  )
}
