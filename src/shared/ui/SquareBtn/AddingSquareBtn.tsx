import cx from 'classnames'

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'

import { SquareBtn } from './SquareBtn'
import useStyles from './SquareBtn.styles'

type Props = {
  onClick: () => void
  disabled: boolean
}

export const AddingSquareBtn = ({ onClick, disabled }: Props) => {
  const classes = useStyles()

  return (
    <SquareBtn onClick={onClick} disabled={disabled} testId="addingSquareBtn">
      <CloseIcon className={cx(classes.btnIcon, classes.rotatedIcon)} />
    </SquareBtn>
  )
}
