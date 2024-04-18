import { FC } from 'react'
import { Icon } from 'gfx-component-lib'

const PriorityFee: FC = () => {
  const priorityFee = 'Low'
  return (
    <div>
      <p>Priority Fee:</p>
      <div className={'inline-flex'}>
        {priorityFee} <Icon src={''} />
      </div>
    </div>
  )
}
export default PriorityFee
