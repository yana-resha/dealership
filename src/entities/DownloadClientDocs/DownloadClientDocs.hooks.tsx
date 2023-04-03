export const useFieldsConfig = () => {
  const configFields = [
    {
      uniqName: 'passport',
      title: 'Паспорт',
      text: '(multiple) Перетащите фото или скан сюда или выберите на компьютере',
      buttonText: 'Загрузить паспорт',
      multipleUpload: true,
      onChange: (files: File[]) => {
        console.info(files)
      },
    },
    {
      uniqName: 'driverLicense',
      title: 'Водительское удостоверение',
      text: 'Перетащите фото или скан сюда или выберите на компьютере',
      buttonText: 'Загрузить удостоверение',
      onChange: (files: File[]) => {
        console.info(files)
      },
    },
    {
      uniqName: 'questionnaire',
      title: 'Анкета',
      text: 'Перетащите фото или скан сюда или выберите на компьютере',
      buttonText: 'Загрузить анкету',
      onChange: (files: File[]) => {
        console.info(files)
      },
    },

    {
      uniqName: 'uploadQuestionnaire',
      buttonText: 'Загрузить анкету',
      onChange: (files: File[]) => {
        console.info(files)
      },
    },
  ]

  return { configFields }
}
