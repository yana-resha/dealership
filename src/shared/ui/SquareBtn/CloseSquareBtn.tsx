import { ReactComponent as CartIcon } from 'assets/icons/cart.svg'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'

import { SquareBtn } from './SquareBtn'
import useStyles from './SquareBtn.styles'

type Props = {
  onClick: () => void
}

export const CloseSquareBtn = ({ onClick }: Props) => {
  const classes = useStyles()

  return (
    <SquareBtn onClick={onClick} testId="closeSquareBtn">
      <CartIcon className={classes.btnIcon} />
    </SquareBtn>
  )
}
