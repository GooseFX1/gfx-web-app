import React, { useEffect } from 'react'
import { Card, Steps } from 'antd'
import styled from 'styled-components'

//#region styles
const CONTAINER = styled.div`
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  background: #1e1e1e;
  .ant-card {
    background: transparent;
  }
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
    background: ${({ theme }) => theme.secondary5};
    border-color: ${({ theme }) => theme.secondary5};
    font-weight: 700;
  }
  .ant-steps-vertical > .ant-steps-item {
    padding: ${({ theme }) => theme.margins['1x']} 0;
  }
  .ant-steps-item-icon {
    line-height: 30px;
  }
  .ant-steps-item-title {
    font-weight: 700;
  }
`
//#endregion

const UploadProgress = (props: { mint: Function; confirm: Function; step: number }) => {
  useEffect(() => {
    const func = async () => {
      await props.mint()
      props.confirm()
    }
    func()
  }, [])

  // const setIconForStep = (currentStep: number, componentStep) => {
  //   if (currentStep === componentStep) {
  //     return <Loader />
  //   }
  //   return null
  // }

  return (
    <CONTAINER>
      <Card bordered={false}>
        <Steps direction="vertical" current={props.step}>
          <Steps.Step className={'white-description'} title="Minting" description="Starting Mint Process" />
          <Steps.Step className={'white-description'} title="Preparing Assets" />
          <Steps.Step
            className={'white-description'}
            title="Signing Metadata Transaction"
            description="Approve the transaction from your wallet"
          />
          <Steps.Step
            className={'white-description'}
            title="Sending Transaction to Solana"
            description="This will take a few seconds."
          />
          <Steps.Step className={'white-description'} title="Waiting for Initial Confirmation" />
          <Steps.Step className={'white-description'} title="Waiting for Final Confirmation" />
          <Steps.Step className={'white-description'} title="Uploading to Arweave" />
          <Steps.Step className={'white-description'} title="Updating Metadata" />
          <Steps.Step
            className={'white-description'}
            title="Signing Token Transaction"
            description="Approve the final transaction from your wallet"
          />
        </Steps>
      </Card>
    </CONTAINER>
  )
}

export default UploadProgress
