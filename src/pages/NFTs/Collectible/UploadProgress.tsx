import React, { useEffect } from 'react'
import { Card, Steps } from 'antd'
import styled from 'styled-components'
import { CenteredDiv } from '../../../styles'

//#region styles
const CONTAINER = styled.div`
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ theme }) => theme.bg2};
  z-index: 1000;

  .ant-steps-item-content,
  .ant-steps-item-container {
    min-width: 100%;
  }
  .ant-steps-item-content {
    display: block;
  }
  .ant-card {
    background: transparent;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
    background: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text1};
    border: 2px solid ${({ theme }) => theme.text1};
    font-weight: 700;
  }

  .ant-steps-item-active {
    .ant-steps-item-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 55px;
      width: 55px;
      margin: 0 auto;
      line-height: 30px;
      border-color: ${({ theme }) => theme.text1};

      .ant-steps-icon,
      .ant-steps-item-title,
      .ant-steps-item-description {
        color: ${({ theme }) => theme.text1};
        opacity: 1;
      }
    }
  }

  .ant-steps-item {
    display: block;
    padding: ${({ theme }) => theme.margin(1)} 0;
    overflow: hidden;
    flex: 1;
    &:last-child {
      flex: 1;
    }
  }
  .ant-steps-item-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 55px;
    width: 55px;
    margin: 0 auto;
    line-height: 30px;
    border-color: ${({ theme }) => theme.text1};

    .ant-steps-icon {
      color: ${({ theme }) => theme.text1};
      opacity: 0.3;
    }
  }
  .ant-steps-item-title {
    color: ${({ theme }) => theme.text1} !important;
    height: 42px;
    width: 100%;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    white-space: normal;
    padding: 0 8px;
    margin-top: ${({ theme }) => theme.margin(1)};
    opacity: 0.3;
  }
  .ant-steps-item-description {
    color: ${({ theme }) => theme.text1} !important;
    width: 100%;
    max-width: 100% !important;
    padding: 0 8px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    margin-top: ${({ theme }) => theme.margin(1)};
    opacity: 0.3;
  }
  .ant-steps-item-finish {
    .ant-steps-item-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 55px;
      width: 55px;
      border-color: transparent;
      background-color: black;
      background: linear-gradient(135deg, ${({ theme }) => theme.secondary1}, #521f5b);
      background-size: 60px 60px;
      background-repeat: no-repeat;
      background-position: center;
    }
    .ant-steps-item-title {
      opacity: 1;
    }
    .ant-steps-item-description {
      opacity: 1;
    }
    > .ant-steps-item-container > .ant-steps-item-tail::after {
      background-color: ${({ theme }) => theme.secondary1};
    }
    .ant-steps-item-icon > .ant-steps-icon {
      color: white;
      opacity: 1;
    }
  }
  .ant-steps-item-title::after {
    top: -37px;
    width: 102px;
    height: 6px;
    background-image: linear-gradient(95deg, #89239f -2%, #bc2bda 104%);
  }
  .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
    background-image: none;
    background-color: transparent;
  }
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
    background-image: none;
    background-color: transparent;
  }
  .ant-steps-horizontal: not(.ant-steps-label-vertical) .ant-steps-item {
    padding: 0;
  }
`

const CAPTION = styled.div`
  font-size: 30px;
  font-weight: 600;
`
const HEADING = styled(CenteredDiv)`
  flex-direction: column;
  height: 58vh;
  .minting-image {
    height: 205px;
    width: 205px;
    margin-bottom: ${({ theme }) => theme.margin(4)};
  }
`
//#endregion

const UploadProgress = (props: { mint: () => void; step: number }) => {
  useEffect(() => {
    const func = async () => {
      await props.mint()
    }
    func()
  }, [])

  return (
    <CONTAINER>
      <HEADING>
        <img className="minting-image" src={`/img/assets/nft-minting.svg`} alt="multiple upload" />
        <CAPTION>Hold on, we are almost there...</CAPTION>
      </HEADING>
      <Card bordered={false}>
        <Steps direction="horizontal" current={props.step}>
          <Steps.Step className={'white-description'} title="Minting" description="Starting Mint Process" />
          <Steps.Step
            className={'white-description'}
            title="Preparing Assets"
            description="Your assets are ready"
          />
          <Steps.Step
            className={'white-description'}
            title="Signing Transaction"
            description="Approve the transaction"
          />
          <Steps.Step
            className={'white-description'}
            title="Sending Transaction"
            description="This will take a few seconds."
          />
          <Steps.Step
            className={'white-description'}
            title="Initial Confirmation"
            description="Waiting for confirmation"
          />
          <Steps.Step
            className={'white-description'}
            title="Final Confirmation"
            description="Waiting for confirmation"
          />
          <Steps.Step className={'white-description'} title="Arweave" description="Uploading to Arweave" />
          <Steps.Step
            className={'white-description'}
            title="Updating Metadata"
            description="with Arweave response"
          />
          <Steps.Step
            className={'white-description'}
            title="Signing Token Transaction"
            description="Approve the final transaction"
          />
        </Steps>
      </Card>
    </CONTAINER>
  )
}

export default UploadProgress
