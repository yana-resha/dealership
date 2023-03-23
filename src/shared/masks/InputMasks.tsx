import IMask from 'imask'

export const maskNoRestrictions = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /.*/,
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskOnlyCyrillicNoDigits = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[а-яА-ЯёЁ -]*$/,
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskFullName = (number: string, unmasked?: boolean) => {
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
  masked.resolve(`${number}`)

  return masked.value
}

export const maskDigitsOnly = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[0-9]+$/,
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskDivisionCode = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000-000',
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskPassport = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '0000 000000',
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskPhoneNumber = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '8-900-000-00-00',
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskEmail = (number: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '{email}{@}{email}',
    blocks: {
      email: {
        mask: /^[a-zA-Z0-9_.-]+$/,
      },
    },
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}
