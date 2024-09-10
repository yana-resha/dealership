import { FindApplication } from 'common/findApplication/findApplications'
import { Page } from 'shared/ui/Page'

export function Dealership() {
  return (
    <Page dataTestId="dealershipPage">
      <FindApplication />
    </Page>
  )
}
