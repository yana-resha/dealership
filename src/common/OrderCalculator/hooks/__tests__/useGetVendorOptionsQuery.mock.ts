import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { NonNullableAdditionalOption } from '../useGetVendorOptionsQuery'

export const mockedUseGetVendorOptionsQueryResponseData: {
  additionalOptions: NonNullableAdditionalOption[]
  additionalOptionsMap: Record<number, NonNullableAdditionalOption>
} = {
  additionalOptions: [
    {
      optionId: 1,
      optionType: OptionType.DEALER,
      optionName: 'ОСАГО',
    },
    {
      optionId: 15,
      optionType: OptionType.DEALER,
      optionName: 'КАСКО',
    },
    {
      optionId: 2,
      optionType: OptionType.DEALER,
      optionName: 'Перекрасить авто',
    },
    {
      optionId: 3,
      optionType: OptionType.DEALER,
      optionName: 'Графика на кузове',
    },
    {
      optionId: 4,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Адаптация и подготовка автомобиля',
    },
    {
      optionId: 5,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Автосигнализация, автозапуск/установка',
    },
    {
      optionId: 6,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Акустическая система, автозвук/установка',
    },
    {
      optionId: 7,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Видеорегистратор/установка',
    },
  ],
  additionalOptionsMap: {
    [1]: {
      optionId: 1,
      optionType: OptionType.DEALER,
      optionName: 'ОСАГО',
    },
    [15]: {
      optionId: 15,
      optionType: OptionType.DEALER,
      optionName: 'КАСКО',
    },
    [2]: {
      optionId: 2,
      optionType: OptionType.DEALER,
      optionName: 'Перекрасить авто',
    },
    [3]: {
      optionId: 3,
      optionType: OptionType.DEALER,
      optionName: 'Графика на кузове',
    },
    [4]: {
      optionId: 4,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Адаптация и подготовка автомобиля',
    },
    [5]: {
      optionId: 5,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Автосигнализация, автозапуск/установка',
    },
    [6]: {
      optionId: 6,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Акустическая система, автозвук/установка',
    },
    [7]: {
      optionId: 7,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Видеорегистратор/установка',
    },
  },
}
