import { Email } from '@sberauto/emailappdc-proto/public'

import { PreparedEmailData } from 'entities/email/types'

export const mockedEmails: Email[] = [
  {
    emailId: 1,
    receivedAt: '2024-06-14 09:51',
    from: 'a@sberauto.com',
    topic: 'Тест почты',
    body: 'Лучшая заявка',
    status: 1,
    attachedFiles: [
      {
        fileName: 'Снимок экрана 2023-11-16 в 14.31.23.png',
        fileId: 1393,
      },
      {
        fileName: 'Снимок экрана 2023-11-20 в 08.34.57.png',
        fileId: 1394,
      },
    ],
    dcAppId: '2024061409542034874458',
  },
  {
    emailId: undefined,
    receivedAt: '2024-06-14 10:04',
    from: 'b.lyskov@sberauto.com',
    topic: 'Тест почты 2',
    body: 'Создай меня.',
    status: 1,
    attachedFiles: [
      {
        fileName: '2024012619247_График пред.pdf',
        fileId: 1397,
      },
      {
        fileName: '2024040309010448582267_Заявление на ДУ.pdf',
        fileId: 1398,
      },
    ],
    dcAppId: '2024061411564507518927',
  },
]

export const mockedPreparedEmails: PreparedEmailData = {
  emails: [
    {
      emailId: 1,
      receivedAt: '2024-06-14 09:51',
      from: 'a@sberauto.com',
      topic: 'Тест почты',
      body: 'Лучшая заявка',
      status: 1,
      attachedFiles: [
        {
          fileName: 'Снимок экрана 2023-11-16 в 14.31.23.png',
          fileId: 1393,
        },
        {
          fileName: 'Снимок экрана 2023-11-20 в 08.34.57.png',
          fileId: 1394,
        },
      ],
      dcAppId: '2024061409542034874458',
    },
  ],
  emailsMap: {
    '1': {
      emailId: 1,
      receivedAt: '2024-06-14 09:51',
      from: 'a@sberauto.com',
      topic: 'Тест почты',
      body: 'Лучшая заявка',
      status: 1,
      attachedFiles: [
        {
          fileName: 'Снимок экрана 2023-11-16 в 14.31.23.png',
          fileId: 1393,
        },
        {
          fileName: 'Снимок экрана 2023-11-20 в 08.34.57.png',
          fileId: 1394,
        },
      ],
      dcAppId: '2024061409542034874458',
    },
  },
}
