import { FormikErrors } from 'formik'

export const DATA: FormikErrors<any> = {
  firstKey: 'Error',
  secondKey: ['Error', 'Error'],
  thirdKey: {
    firstKey: 'Error',
    secondKey: ['Error', 'Error'],
    thirdKey: [
      {
        firstKey: 'Error',
        secondKey: ['Error', 'Error'],
      },
      {
        firstKey: 'Error',
        secondKey: ['Error', 'Error'],
      },
    ],
  },
  fourth: [
    {
      firstKey: [
        {
          firstKey: 'Error',
          secondKey: ['Error', 'Error'],
          thirdKey: [
            {
              firstKey: 'Error',
              secondKey: ['Error', 'Error'],
            },
            {
              firstKey: 'Error',
              secondKey: ['Error', 'Error'],
            },
          ],
        },
      ],
    },
  ],
}

export const EXPECTED_DATA = [
  'firstKey',
  'secondKey',
  'thirdKey.firstKey',
  'thirdKey.secondKey',
  'thirdKey.thirdKey[0].firstKey',
  'thirdKey.thirdKey[0].secondKey',
  'thirdKey.thirdKey[1].firstKey',
  'thirdKey.thirdKey[1].secondKey',
  'fourth[0].firstKey[0].firstKey',
  'fourth[0].firstKey[0].secondKey',
  'fourth[0].firstKey[0].thirdKey[0].firstKey',
  'fourth[0].firstKey[0].thirdKey[0].secondKey',
  'fourth[0].firstKey[0].thirdKey[1].firstKey',
  'fourth[0].firstKey[0].thirdKey[1].secondKey',
]
