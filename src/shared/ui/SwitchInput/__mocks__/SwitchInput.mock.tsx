import React, { useCallback } from 'react'

import { SwitchInputProps } from '../switchInput.types'

export const MockedSwitchInput = (props: SwitchInputProps) => {
  const { label, value, onChange, isError, errorMessage, id, disabled, afterChange } = props

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked)
      afterChange?.(event)
    },
    [onChange, afterChange],
  )

  return (
    <div>
      <label>
        <input
          type="checkbox"
          id={id}
          data-testid={id}
          checked={value}
          disabled={disabled}
          onChange={handleChange}
        />
        {label}
      </label>
      {isError && <span data-testid={id + 'ErrorMessage'}>{errorMessage}</span>}
    </div>
  )
}
