import { ReactComponent as CartIcon } from 'assets/icons/cart.svg'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'

import { SquareBtn } from './SquareBtn'
import useStyles from './SquareBtn.styles'

type Props = {
  onClick: () => void
  disabled?: boolean
}

export const CloseSquareBtn = ({ onClick, disabled = false }: Props) => {
  const classes = useStyles()

  return (
    <SquareBtn onClick={onClick} disabled={disabled} testId="closeSquareBtn">
      <CartIcon className={classes.btnIcon} />
    </SquareBtn>
  )
}
