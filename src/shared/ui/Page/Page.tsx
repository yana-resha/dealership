import { MutableRefObject, PropsWithChildren } from 'react'

import { useStyles } from './Page.styles'

type Props = {
  dataTestId: string
  ref?: MutableRefObject<HTMLDivElement | null>
}
export const Page = (props: PropsWithChildren<Props>) => {
  const styles = useStyles()
  const { children, dataTestId, ref } = props

  return (
    <div className={styles.page} data-testid={dataTestId} ref={ref}>
      {children}
    </div>
  )
}
