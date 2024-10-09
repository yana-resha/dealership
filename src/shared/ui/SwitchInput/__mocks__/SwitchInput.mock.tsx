import { SwitchInputProps } from '../switchInput.types'

export const MockedSwitchInput = ({
  label,
  value,
  onChange,
  isError,
  errorMessage,
  id,
  disabled,
}: SwitchInputProps) => (
  <div>
    <label>
      <input
        type="checkbox"
        id={id}
        data-testid={id}
        checked={value}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
    {isError && <span data-testid={id + 'ErrorMessage'}>{errorMessage}</span>}
  </div>
)
