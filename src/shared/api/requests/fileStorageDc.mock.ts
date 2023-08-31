const currentDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()

export const catalogData = {
  catalog: [
    {
      id: 2,
      name: 'myFolder_2',
      extension: '',
      type: 0,
      downloadDate: '2023-08-25T11:24:26Z',
    },
    {
      id: 3,
      name: 'logo192.png',
      extension: 'png',
      type: 1,
      // сегодняшняя дата
      downloadDate: currentDate,
    },
    {
      id: 4,
      name: 'Заявление на открытие счёта.pdf',
      extension: 'pdf',
      type: 1,
      downloadDate: '2023-08-28T13:07:56Z',
    },
  ],
  prevFolderId: 0,
  folderName: 'myFolder',
}

export const foundData = {
  found: [
    {
      name: 'fileName_1',
      type: 1,
      folderId: 0,
      folderName: 'folder_1',
    },
    {
      name: 'fileName_2',
      type: 1,
      folderId: 2,
      folderName: 'folder_2',
    },
  ],
}
