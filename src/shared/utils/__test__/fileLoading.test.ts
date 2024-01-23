import { transformFileName } from '../fileLoading'

describe('fileLoading', () => {
  it('Имена файлов заменяются, префикс подставляется', () => {
    expect(transformFileName(2, 'prefix')).toBe('prefix_ИУК')
    expect(transformFileName(7, 'prefix')).toBe('prefix_График фин')
    expect(transformFileName(8, 'prefix')).toBe('prefix_Счет')
    expect(transformFileName(9, 'prefix')).toBe('prefix_Заявление-анкета')
    expect(transformFileName(11, 'prefix')).toBe('prefix_График пред')
    expect(transformFileName(14, 'prefix')).toBe('prefix_Письмо об одобрении')
    expect(transformFileName(15, 'prefix')).toBe('prefix_Уведомление о ПДН')
    expect(transformFileName(16, 'prefix')).toBe('prefix_Заявление на ДУ')
    expect(transformFileName(17, 'prefix')).toBe('prefix_Уведомление о ДУ')
  })

  it('Если нет documentType в конфиге, возвращается undefined', () => {
    expect(transformFileName(0, 'prefix')).toBe(undefined)
  })

  it('Если нет префикса, возвращается новое имя без префикса', () => {
    expect(transformFileName(2)).toBe('ИУК')
  })
})
