export const compareStrings = (a: string, b: string) => {
  // Необходимо выбрать группы состоящие из цифр \d+ , но так же нужны оставшиеся группы,
  // потому добавлено [^\d]+
  const rx = /[^\d]+|\d+/gi
  const aSplit = a.match(rx) ?? []
  const bSplit = b.match(rx) ?? []
  // Разбиваем строку на фрагменты из одних цифр и остальных символов
  // Проходимся по фрагментам сравнивая фрагменты от a и b одинакового индекса.
  for (let i = 0, l = Math.min(aSplit.length, bSplit.length); i < l; i++) {
    const aSubStr = aSplit[i].toLowerCase()
    const bSubStr = bSplit[i].toLowerCase()
    if (aSubStr === bSubStr) {
      continue
    }
    const aNum = parseInt(aSubStr, 10)
    const bNum = parseInt(bSubStr, 10)
    // Сравниваем номера, значит 2 будет перед 12
    if (aNum && bNum) {
      return aNum - bNum
    }
    // При сравнении номера и текста, номер ставим последним
    if (aNum || bNum) {
      return aSubStr < bSubStr ? 1 : -1
    }

    // Текст сравниваем как обычно
    return aSubStr > bSubStr ? 1 : -1
  }

  return 0
}
