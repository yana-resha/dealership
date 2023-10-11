import SberTypography from 'shared/ui/SberTypography'

type Props = {
  name: string
  price: string
  creditStatus: string
}

export function AdditionalOptionItem({ name, price, creditStatus }: Props) {
  return (
    <>
      <SberTypography sberautoVariant="body3" component="p" gridColumn="span 2" minWidth="min-content">
        {name}
      </SberTypography>
      <SberTypography sberautoVariant="body3" component="p" gridColumn="span 1" minWidth="min-content">
        {price}
      </SberTypography>
      <SberTypography sberautoVariant="body3" component="p" gridColumn="span 4" minWidth="min-content">
        {creditStatus}
      </SberTypography>
    </>
  )
}
