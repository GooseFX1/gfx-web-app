import React, { useEffect } from 'react'
import { Card, Steps } from 'antd'

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
          <Steps.Step
            className={'white-description'}
            title="Minting"
            description="Starting Mint Process"
            icon={setIconForStep(props.step, 0)}
          />
          <Steps.Step className={'white-description'} title="Preparing Assets" icon={setIconForStep(props.step, 1)} />
          <Steps.Step
            className={'white-description'}
            title="Signing Metadata Transaction"
            description="Approve the transaction from your wallet"
            icon={setIconForStep(props.step, 2)}
          />
          <Steps.Step
            className={'white-description'}
            title="Sending Transaction to Solana"
            description="This will take a few seconds."
            icon={setIconForStep(props.step, 3)}
          />
          <Steps.Step
            className={'white-description'}
            title="Waiting for Initial Confirmation"
            icon={setIconForStep(props.step, 4)}
          />
          <Steps.Step
            className={'white-description'}
            title="Waiting for Final Confirmation"
            icon={setIconForStep(props.step, 5)}
          />
          <Steps.Step
            className={'white-description'}
            title="Uploading to Arweave"
            icon={setIconForStep(props.step, 6)}
          />
          <Steps.Step className={'white-description'} title="Updating Metadata" icon={setIconForStep(props.step, 7)} />
          <Steps.Step
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
