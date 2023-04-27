import { Application, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { compact } from 'lodash'

import { PreparedTableData } from 'entities/application/ApplicationTable/ApplicationTable.types'
import { getFullName } from 'shared/utils/clientNameTransform'

export const transformResToTableData = (data: Application[]): PreparedTableData[] =>
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
      source: source ?? '',
      decisionTerm: decisionTerm ?? '',
      //NOTE: непонятно что отвечает за иконку уточнить
      isDC: true,
      status: status ?? StatusCode.STATUS_CODE_ERROR,
    }
  })