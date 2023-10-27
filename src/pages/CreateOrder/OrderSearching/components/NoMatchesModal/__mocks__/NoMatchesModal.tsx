import React from 'react'

import { Dialog } from '@mui/material'

type Props = {
  isVisible: boolean
  onClose: () => void
}
export function NoMatchesModal({ isVisible, onClose }: Props) {
  return (
    <Dialog open={isVisible} onClose={onClose}>
      <div data-testid="noMatchesModal" />
    </Dialog>
  )
}
