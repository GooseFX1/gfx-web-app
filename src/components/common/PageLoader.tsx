import React, { FC } from 'react'
import { useDarkMode } from '../../context'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'

const PageLoader: FC = () => {
  const { mode } = useDarkMode()
  const { RiveComponent } = useRive({
    src: `https://media.goosefx.io/webapp/pageLoader_${mode}.riv`,
    autoplay: true,
    stateMachines: ['State Machine 1'],
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    })
  })

  return (
    <div
      style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100dvh - 56px)'
      }}
    >
      <div style={{ verticalAlign: 'center', width: '500px', height: '500px' }}>
        <RiveComponent
          width={'500px'}
          height={'500px'}
          style={{ verticalAlign: 'center', width: '500px', height: '500px' }}
        />
      </div>
    </div>
  )
}

export default PageLoader
