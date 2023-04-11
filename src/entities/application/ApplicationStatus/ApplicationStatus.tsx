import { Status } from 'shared/ui/Status/Status'

const getStatus = (
  status?: string,
  contractSignedFlag?: boolean,
  contractFinancingFlag?: boolean,
  contractFinancedFlag?: boolean,
  accountFlag?: boolean,
  contractPrintFlag?: boolean,
) => {
  if (status) {
    const isFinallyApproved = !!accountFlag && !contractPrintFlag && status === 'approved'
    const isFormation = !contractSignedFlag && !!contractPrintFlag && status === 'approved'
    const isCanceledDeal = !!contractSignedFlag && status === 'canceled'
    const isCanceled = !contractSignedFlag && status === 'canceled'
    const isSigned =
      !!contractSignedFlag && !contractFinancingFlag && !contractFinancedFlag && status === 'approved'
    const isProcessed = !!contractFinancingFlag && !contractFinancedFlag && status === 'approved'
    const isFinanced = !contractFinancingFlag && !!contractFinancedFlag && status === 'approved'
    const isApproved =
      !contractFinancingFlag &&
      !contractFinancedFlag &&
      !contractSignedFlag &&
      !contractPrintFlag &&
      !accountFlag &&
      status === 'approved'

    switch (true) {
      case status === 'initial':
        return PreparedStatus.initial
      case status === 'processed':
        return PreparedStatus.processed
      case isApproved:
        return PreparedStatus.approved
      case isFinallyApproved:
        return PreparedStatus.finallyApproved
      case isFormation:
        return PreparedStatus.formation
      case status === 'rejected':
        return PreparedStatus.rejected
      case isCanceledDeal:
        return PreparedStatus.canceledDeal
      case isCanceled:
        return PreparedStatus.canceled
      case isSigned:
        return PreparedStatus.signed
      case isProcessed:
        return PreparedStatus.processed
      case isFinanced:
        return PreparedStatus.financed
      default:
        return PreparedStatus.error
    }
  }

  return PreparedStatus.error
}

enum PreparedStatus {
  initial = 'Черновик',
  processed = 'Ожидает решение',
  approved = 'Предварительно одобрен',
  finallyApproved = 'Кредит одобрен',
  formation = 'Формирование КД',
  rejected = 'Отказ',
  canceledDeal = 'Кд Отменен',
  canceled = 'Отменен',
  signed = 'КД подписан',
  authorized = 'Ожидание финансирования',
  financed = 'Кредит выдан',
  error = 'Ошибка',
}

//FIXME: Брать цвета из темы
export const statusListItems: Record<string, string> = {
  [PreparedStatus.initial]: '#0000FF',
  [PreparedStatus.processed]: '#FF8C00',
  [PreparedStatus.approved]: '#228B22',
  [PreparedStatus.finallyApproved]: '#008000',
  [PreparedStatus.formation]: '#008000',
  [PreparedStatus.rejected]: '#8B0000',
  [PreparedStatus.canceledDeal]: '#D3D3D3',
  [PreparedStatus.canceled]: '#D3D3D3',
  [PreparedStatus.signed]: '#008000',
  [PreparedStatus.authorized]: '#00FF00',
  [PreparedStatus.financed]: '#00FF7F',
  [PreparedStatus.error]: '#FF0000',
}

type Props = {
  status: string
}

export const ApplicationStatus = ({ status }: Props) => {
  const preparedStatus = getStatus(status)

  return <Status bgColor={statusListItems[preparedStatus]}>{preparedStatus}</Status>
}
