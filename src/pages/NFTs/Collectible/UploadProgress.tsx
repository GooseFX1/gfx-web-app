import React from 'react'
import { Card, Steps, Step } from 'antd'

const WaitingStep = (props: { mint: Function; minting: boolean; confirm: Function; step: number }) => {
  useEffect(() => {
    const func = async () => {
      await props.mint()
      props.confirm()
    }
    func()
  }, [])

  const setIconForStep = (currentStep: number, componentStep) => {
    if (currentStep === componentStep) {
      return '...loading'
    }
    return null
  }

  return (
    <div
      style={{
        marginTop: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Card>
        <Steps direction="vertical" current={props.step}>
          <Step
            className={'white-description'}
            title="Minting"
            description="Starting Mint Process"
            icon={setIconForStep(props.step, 0)}
          />
          <Step className={'white-description'} title="Preparing Assets" icon={setIconForStep(props.step, 1)} />
          <Step
            className={'white-description'}
            title="Signing Metadata Transaction"
            description="Approve the transaction from your wallet"
            icon={setIconForStep(props.step, 2)}
          />
          <Step
            className={'white-description'}
            title="Sending Transaction to Solana"
            description="This will take a few seconds."
            icon={setIconForStep(props.step, 3)}
          />
          <Step
            className={'white-description'}
            title="Waiting for Initial Confirmation"
            icon={setIconForStep(props.step, 4)}
          />
          <Step
            className={'white-description'}
            title="Waiting for Final Confirmation"
            icon={setIconForStep(props.step, 5)}
          />
          <Step className={'white-description'} title="Uploading to Arweave" icon={setIconForStep(props.step, 6)} />
          <Step className={'white-description'} title="Updating Metadata" icon={setIconForStep(props.step, 7)} />
          <Step
            className={'white-description'}
            title="Signing Token Transaction"
            description="Approve the final transaction from your wallet"
            icon={setIconForStep(props.step, 8)}
          />
        </Steps>
      </Card>
    </div>
  )
}
