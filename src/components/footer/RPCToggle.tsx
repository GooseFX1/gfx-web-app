import { FC } from 'react'
import { Icon } from 'gfx-component-lib'

const RPCToggle: FC = () => {
  const rpcOption = 'Custom'
  const src = '/img/mainnav/settings.svg'
  return (
    <div>
      <p>RPC:</p>
      <div className={'inline-flex'}>
        {rpcOption} <Icon src={src} />
      </div>
    </div>
  )
}

export default RPCToggle
