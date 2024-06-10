import IMask from 'imask'

export type Masked = (value: string, unmasked?: boolean) => string

export const maskNoRestrictions = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /.*/,
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskOnlyCyrillicNoDigits = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[а-яА-ЯёЁ '-.,)(]*$/,
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

export const maskName = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[а-яА-ЯёЁ '-.,IV)(]*$/,
    // Если вводится первый символ, делаем его прописным.
    prepare: (appended: string, masked: { value: string }) => {
      if (!masked.value.length) {
        return appended.toUpperCase()
      }

      return appended
    },
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
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

export const maskInternationalPassport = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '00 0000000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskPensionCertificate = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000-000-000 00',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskINN = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000000000000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskCommonPhoneNumber = (
  number: string,
  unmasked?: boolean,
  definition?: Record<'#', string | RegExp>,
) => {
  const masked = IMask.createMask({
    mask: '+{7} #00 000 00 00',
    definitions: definition
      ? definition
      : {
          '#': /[2,3,4,8,9]/,
        },
    prepare: (appended: string, masked: { value: string }) => {
      if (appended === '8' && masked.value === '') {
        return ''
      }

      return appended
    },
  })
  masked.resolve(`${number}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskMobilePhoneNumber = (number: string, unmasked?: boolean) =>
  maskCommonPhoneNumber(number, unmasked, { '#': '{9}' })

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

// Число с сотыми после запятой
export const maskPrice = (value: string, unmasked?: boolean) => {
  const SEPARATOR = '.'

  const masked = IMask.createMask({
    mask: /^(0|([1-9]+\d*))?(\.\d{0,2})?$/,
  })
  masked.resolve(`${value}`)

  const sections = masked.unmaskedValue.split(SEPARATOR)
  const isLastCharDot = masked.unmaskedValue[masked.unmaskedValue.length - 1] === '.'
  const { length: integerPartLength } = sections[0]
  // Lобавляем пробелы для разделения разрядов
  if (integerPartLength > 3) {
    const strWithSpaces = sections[0].split('').reduceRight((acc, char, i) => {
      const spaceOrNothing = (integerPartLength - i) % 3 === 0 ? ' ' : ''

      return spaceOrNothing + char + acc
    }, '')

    const suffix = sections[1] ? '.' + sections[1] : isLastCharDot ? '.' : ''
    const maskedString = `${strWithSpaces.trimStart()}${suffix}`

    return unmasked ? masked.unmaskedValue : maskedString
  }

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

export const maskVin = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[A-Z0-9\s]{1,17}$/,
    prepare: (str: string) => str.toUpperCase(),
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskBankIdentificationCode = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000000000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskInn = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '000000000000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskBankAccountNumber = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '00000000000000000000',
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

export const maskFolderName = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: /^[^\\/):*?"<>|+]+$/,
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskDriverLicenseIssuedCode = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: '00000',
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}

export const maskMileage = (value: string, unmasked?: boolean) => {
  const masked = IMask.createMask({
    mask: Number,
    thousandsSeparator: ' ',
    max: 9999,
  })
  masked.resolve(`${value}`)

  return unmasked ? masked.unmaskedValue : masked.value
}
