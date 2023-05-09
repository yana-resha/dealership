import React, { useState } from 'react'

import { MaskedInputProps } from '../maskedInput.types'

export const MockedMaskedInput = (props: MaskedInputProps) => {
  const { label, isError, errorMessage, id, mask, disabled, value, onChange, placeholder, InputProps } = props
  const [fieldValue, setFieldValue] = useState(value || '')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue(mask(event.target.value.trimStart(), true))
    onChange?.(mask(event.target.value.trimStart(), true))
  }

  return (
    <div>
      <label>
        <input
          data-testid={id}
          type="text"
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
          readOnly={InputProps?.readOnly}
        />
        {label}
      </label>
      {isError && <span data-testid={id + 'ErrorMessage'}>{errorMessage}</span>}
    </div>
  )
}
