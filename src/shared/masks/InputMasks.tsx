import IMask from 'imask'

export const maskNoRestrictions = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /.*/,
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskOnlyCyrillicNoDigits = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[а-яА-ЯёЁ -]*$/,
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskCyrillicAndDigits = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[а-яА-ЯёЁ0-9\s-]+$/,
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskFullName = (value: string) => {
  const masked = IMask.createMask({
    mask: '{capitalLetter}{namePart}{ }{capitalLetter}{namePart}{ }{capitalLetter}{namePart}',
    blocks: {
      capitalLetter: {
        mask: /^[а-яА-ЯёЁ]$/,
        prepare: function (str: string) {
          return str.charAt(0).toUpperCase() + str.slice(1)
        },
      },
      namePart: {
        mask: /^[а-яА-ЯёЁ-]{0,49}$/,
      },
    },
  })
  masked.resolve(`${value}`)

  return masked.value
}

export const maskDigitsOnly = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[0-9]+$/,
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskDivisionCode = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000-000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskPassport = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '0000 000000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskPhoneNumber = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '{8}-{9}00-000-00-00',
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskEmail = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '{email}{@}{email}',
    blocks: {
      email: {
        mask: /^[a-zA-Z0-9_.-]+$/,
      },
    },
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskOnlyNumbersWithSeparator = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: Number,
    thousandsSeparator: ' ',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}
