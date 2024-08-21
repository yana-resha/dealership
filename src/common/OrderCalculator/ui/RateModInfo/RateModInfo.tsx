import { ReactComponent as InfoIcon } from 'assets/icons/info.svg'
import { CustomTooltip } from 'shared/ui/CustomTooltip'

export function RateModInfo() {
  return (
    <CustomTooltip
      arrow
      title={<span>При подключении дополнительной услуги банка доступно снижение ставки</span>}
      placement="right"
    >
      <InfoIcon />
    </CustomTooltip>
  )
}
