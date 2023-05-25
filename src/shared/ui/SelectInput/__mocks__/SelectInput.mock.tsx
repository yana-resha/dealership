import React, { useState } from 'react'

import { SelectInputProps } from '../selectInput.types'

export function MockedSelectInput<T extends string | number>(props: SelectInputProps<T>) {
  const { label, value, onChange, isError, errorMessage, id, placeholder, disabled } = props
  const [fieldValue, setFieldValue] = useState(value || '')

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFieldValue(event.target.value)
    onChange?.(event.target.value)
  }

  return (
    <div>
      <label>
        <select
          data-testid={id}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
        >
          {props.options.map(option =>
            typeof option === 'string' || typeof option === 'number' ? (
              <option key={option} value={option}>
                {option}
              </option>
            ) : (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ),
          )}
        </select>
        {label}
      </label>
      {isError && <span data-testid={id + 'ErrorMessage'}>{errorMessage}</span>}
    </div>
  )
}
