import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { Downloader } from 'shared/ui/Downloader'
import SberTypography from 'shared/ui/SberTypography'

type Props = {
  onClick: () => Promise<File | undefined>
  disabled: boolean
}

export function FeeScheduleBtn({ onClick, disabled }: Props) {
  return (
    <Downloader onDownloadFile={onClick} gridColumn="span 2" disabled={disabled} icon={<ScheduleIcon />}>
      <SberTypography sberautoVariant="body3" component="p">
        График платежей
      </SberTypography>
    </Downloader>
  )
}
