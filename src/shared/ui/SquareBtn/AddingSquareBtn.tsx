import cx from 'classnames'

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'

import { SquareBtn } from './SquareBtn'
import useStyles from './SquareBtn.styles'

type Props = {
  onClick: () => void
}

export const AddingSquareBtn = ({ onClick }: Props) => {
  const classes = useStyles()

  return (
    <SquareBtn onClick={onClick} testId="addingSquareBtn">
      <CloseIcon className={cx(classes.btnIcon, classes.rotatedIcon)} />
    </SquareBtn>
  )
}
