import React from 'react'

import { DateInputProps } from '../dateInput.types'

export const MockedDateInput = (props: DateInputProps) => {
  const { label, errorMessage, isError, id, onChange, disabled } = props

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(new Date(event.target.value))
  }

  return (
    <div>
      <label>
        <input data-testid={id} type="date" id={id} onChange={handleDateChange} disabled={disabled} />
        {label}
      </label>
      {isError && <span data-testid={id + 'ErrorMessage'}>{errorMessage}</span>}
    </div>
  )
}
