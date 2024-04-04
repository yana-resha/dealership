import { OptionID, OptionType } from '@sberauto/dictionarydc-proto/public'

import { NonNullableAdditionalOption } from '../useGetVendorOptionsQuery'

export const mockedUseGetVendorOptionsQueryResponseData: {
  additionalOptions: NonNullableAdditionalOption[]
  additionalOptionsMap: Record<number, NonNullableAdditionalOption>
} = {
  additionalOptions: [
    {
      optionId: OptionID.GAP,
      optionType: OptionType.DEALER,
      optionName: 'ОСАГО',
    },
    {
      optionId: OptionID.CASCO,
      optionType: OptionType.DEALER,
      optionName: 'КАСКО',
    },
    {
      optionId: OptionID.TONING_PAINTING,
      optionType: OptionType.DEALER,
      optionName: 'Перекрасить авто',
    },
    {
      optionId: OptionID.OTHER,
      optionType: OptionType.DEALER,
      optionName: 'Графика на кузове',
    },
    {
      optionId: OptionID.VEHICLE_ADAPTATION,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Адаптация и подготовка автомобиля',
    },
    {
      optionId: OptionID.ALARM_AUTOSTART,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Автосигнализация, автозапуск/установка',
    },
    {
      optionId: OptionID.ACOUSTIC_SYSTEM,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Акустическая система, автозвук/установка',
    },
    {
      optionId: OptionID.DVR,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Видеорегистратор/установка',
    },
    {
      optionId: OptionID.RIMS_TIRES_WHEELS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Диски/резина/колеса',
    },
    {
      optionId: OptionID.CRANKCASE_GEARBOXES,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита картера, коробки передач/установка',
    },
    {
      optionId: OptionID.RADIATOR_PROTECTIVE_FILMS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита решётки радиатора, защитные плёнки/установка',
    },
    {
      optionId: OptionID.CARPETS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Ковры в салон/багажник',
    },
    {
      optionId: OptionID.CAR_TREATMENT_KIT,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Комплект для обработки автомобиля',
    },
    {
      optionId: OptionID.ANTINOISE_ANTICORROSION,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Обработка антишум, антикоррозия, полировка',
    },
    {
      optionId: OptionID.FENDERS_CROSSBARS_ROOFRAILS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Подкрылки,брызговики, дуги поперечные,рейлинги /установка',
    },
    {
      optionId: OptionID.CAR_TUNING,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Тюнинг автомобиля',
    },
  ],
  additionalOptionsMap: {
    [OptionID.GAP]: {
      optionId: OptionID.GAP,
      optionType: OptionType.DEALER,
      optionName: 'ОСАГО',
    },
    [OptionID.CASCO]: {
      optionId: OptionID.CASCO,
      optionType: OptionType.DEALER,
      optionName: 'КАСКО',
    },
    [OptionID.TONING_PAINTING]: {
      optionId: OptionID.TONING_PAINTING,
      optionType: OptionType.DEALER,
      optionName: 'Перекрасить авто',
    },
    [OptionID.OTHER]: {
      optionId: OptionID.OTHER,
      optionType: OptionType.DEALER,
      optionName: 'Графика на кузове',
    },
    [OptionID.VEHICLE_ADAPTATION]: {
      optionId: OptionID.VEHICLE_ADAPTATION,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Адаптация и подготовка автомобиля',
    },
    [OptionID.ALARM_AUTOSTART]: {
      optionId: OptionID.ALARM_AUTOSTART,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Автосигнализация, автозапуск/установка',
    },
    [OptionID.ACOUSTIC_SYSTEM]: {
      optionId: OptionID.ACOUSTIC_SYSTEM,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Акустическая система, автозвук/установка',
    },
    [OptionID.DVR]: {
      optionId: OptionID.DVR,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Видеорегистратор/установка',
    },
    [OptionID.RIMS_TIRES_WHEELS]: {
      optionId: OptionID.RIMS_TIRES_WHEELS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Диски/резина/колеса',
    },
    [OptionID.CRANKCASE_GEARBOXES]: {
      optionId: OptionID.CRANKCASE_GEARBOXES,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита картера, коробки передач/установка',
    },
    [OptionID.RADIATOR_PROTECTIVE_FILMS]: {
      optionId: OptionID.RADIATOR_PROTECTIVE_FILMS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита решётки радиатора, защитные плёнки/установка',
    },
    [OptionID.CARPETS]: {
      optionId: OptionID.CARPETS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Ковры в салон/багажник',
    },
    [OptionID.CAR_TREATMENT_KIT]: {
      optionId: OptionID.CAR_TREATMENT_KIT,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Комплект для обработки автомобиля',
    },
    [OptionID.ANTINOISE_ANTICORROSION]: {
      optionId: OptionID.ANTINOISE_ANTICORROSION,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Обработка антишум, антикоррозия, полировка',
    },
    [OptionID.FENDERS_CROSSBARS_ROOFRAILS]: {
      optionId: OptionID.FENDERS_CROSSBARS_ROOFRAILS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Подкрылки,брызговики, дуги поперечные,рейлинги /установка',
    },
    [OptionID.CAR_TUNING]: {
      optionId: OptionID.CAR_TUNING,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Тюнинг автомобиля',
    },
  },
}
