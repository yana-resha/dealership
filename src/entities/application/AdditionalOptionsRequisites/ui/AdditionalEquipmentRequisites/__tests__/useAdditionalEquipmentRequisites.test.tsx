import { PropsWithChildren } from 'react'

import { Form, Formik } from 'formik'

import { BriefOrderCalculatorFields } from 'common/OrderCalculator/types'
import { MockProviders } from 'tests/mocks'

const USE_ADDITIONAL_EQUIPMENT_REQUISITES_PARAMS = {
  isCustomFields: false,
  isRequisitesFetched: true,
  namePrefix: '',
  beneficiaryBank: 'bank',
  productType: 1,
  requisites: undefined,
  legalPersonCode: 'legalPersonCode',
  productCost: '100',
  isCredit: false,
}

const createWrapper =
  (initialValues: Partial<BriefOrderCalculatorFields>) =>
  ({ children }: PropsWithChildren) =>
    (
      <MockProviders>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Form>{children}</Form>
        </Formik>
      </MockProviders>
    )

describe('useAdditionalEquipmentRequisites', () => {
  describe('Хук врзвращает корректные данные', () => {
    it.todo('DCB-1410 Тесты для useAdditionalEquipmentRequisites')
  })
})
