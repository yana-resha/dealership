import { StatusCode, Application } from '@sberauto/loanapplifecycledc-proto/public'

import { PreparedTableData } from 'entities/application/ApplicationTable/ApplicationTable.types'
import { getFullName } from 'shared/utils/clientNameTransform'

const sourceMap = {
  sberbankru: 'Сайт',
  sberbankru2: 'Сайт',
  portalda: 'PortalDA',
  sberbankrucall: 'ЕРКЦ',
  marketing: 'RBC',
  broker_before_chat: 'СберАвто',
  broker_after_chat: 'СберАвто',
  sbol_after_chat: 'СберАвто',
  autoteka: 'Автотека',
  autoru: 'Auto.ru',
  avito: 'Avito',
  classified: 'Дром',
  broker: 'СберАвто',
  dc: 'ДЦ',
  sbol: 'SBOL',
  ecredit: 'eCredit',
  ast: 'АСТ',
}

export const makeApplicationTableData = (data: Application[]): PreparedTableData[] =>
  data.map(application => {
    const {
      applicationNumber,
      applicationUpdateDate,
      firstName,
      lastName,
      middleName,
      vendorCode,
      source,
      status,
      decisionTerm,
    } = application

    return {
      applicationNumber: applicationNumber ?? '',
      applicationUpdateDate: applicationUpdateDate ?? '',
      fullName: getFullName(firstName, lastName, middleName),
      vendorCode: vendorCode ?? '',
      source: sourceMap[(source || '').toLowerCase() as keyof typeof sourceMap] || source || '',
      decisionTerm: typeof decisionTerm === 'number' && decisionTerm >= 0 ? decisionTerm : '-',
      status: status ?? StatusCode.ERROR,
    }
  })
