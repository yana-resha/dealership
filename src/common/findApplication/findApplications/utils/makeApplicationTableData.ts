import { StatusCode, Application } from '@sberauto/loanapplifecycledc-proto/public'

import { PreparedTableData } from 'entities/application/ApplicationTable/ApplicationTable.types'
import { getFullName } from 'shared/utils/clientNameTransform'

const sourceMap = {
  Sberbankru: 'Сайт',
  Sberbankru2: 'Сайт',
  Portalda: 'PortalDA',
  Sberbankrucall: 'ЕРКЦ',
  Marketing: 'RBC',
  broker_before_chat: 'СберАвто',
  broker_after_chat: 'СберАвто',
  sbol_after_chat: 'СберАвто',
  autoteka: 'Автотека',
  autoru: 'Auto.ru',
  avito: 'Avito',
  classified: 'Дром',
  broker: 'СберАвто',
  DC: 'ДЦ',
  SBOL: 'SBOL',
  ECREDIT: 'eCredit',
  AST: 'АСТ',
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
      source: sourceMap[(source || '') as keyof typeof sourceMap] || source || '',
      decisionTerm: typeof decisionTerm === 'number' && decisionTerm >= 0 ? decisionTerm : '-',
      status: status ?? StatusCode.ERROR,
    }
  })
