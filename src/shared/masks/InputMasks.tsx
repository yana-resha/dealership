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

export const maskOnlyDigitsWithSeparator = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: Number,
    thousandsSeparator: ' ',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskVin = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[A-Z0-9\s]{1,17}$/,
    prepare: (str: string) => str.toUpperCase(),
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskPercent = (value: string) => {
  const SEPARATOR = '.'
  const masked = IMask.createMask({
    mask: new RegExp(`^[0-9${SEPARATOR}]+$`),
  })
  masked.resolve(`${value}`)

  const sections = masked.value.split(SEPARATOR).reduce<string[]>((acc, cur) => {
    if (acc.length < 2 && cur) {
      acc.push(cur)
    }

    return acc
  }, [])
  if (!sections[0]) {
    return ''
  }
  if (parseInt(sections[0], 10) > 100) {
    const suffix = sections[0].slice(2)
    sections[0] = sections[0].slice(0, 2)
    sections[1] = suffix + (sections[1] || '')
  }
  if (sections[1]) {
    sections[1] = sections[1].slice(0, 2)
  }
  if (masked.value.includes(SEPARATOR) && !sections[1]) {
    return sections[0] + SEPARATOR
  }

  return sections.join(SEPARATOR)
}

export const maskBankIdentificationCode = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000000000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskBankAccountNumber = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '0000 0000 0000 0000 0000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskСarPassportId = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '00 aa 000000',
    prepare: (str: string) => {
      const character = str.toUpperCase()
      const regex = /[А-Я0-9]/

      if (!regex.test(character)) {
        return ''
      }

      return character
    },
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskElectronicСarPassportId = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000 0000 0000 0000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}
