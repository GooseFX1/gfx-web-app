import React from 'react'
import { stakedEarnedMockData } from './mockData'
import styled from 'styled-components'
import { Button } from 'antd'

const STYLED_EXPANDED_ROW = styled.div`
  padding-top: ${({ theme }) => theme.margins['4x']};
  padding-right: ${({ theme }) => theme.margins['10x']};
  padding-bottom: ${({ theme }) => theme.margins['7x']};
  padding-left: ${({ theme }) => theme.margins['4x']};
  background-image: linear-gradient(to bottom, #39253e, rgba(42, 42, 42, 0));
`

const STYLED_EXPANDED_CONTENT = styled.div`
  display: flex;
  align-items: center;
`
const STYLED_LEFT_CONTENT = styled.div`
  width: 23%;
  &.connected {
    width: 36%;
  }
  .left-inner {
    display: flex;
    align-items: center;
  }
  &.disconnected {
    .left-inner {
      max-width: 270px;
    }
  }
  .farm-logo {
    width: 60px;
    height: 60px;
  }
  button {
    width: 169px;
    height: 52px;
    line-height: 42px;
    border-radius: 52px;
    font-family: Montserrat;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    color: #fff;
    background-color: #6b33b0 !important;
    border-color: #6b33b0 !important;
    margin-left: ${({ theme }) => theme.margins['4x']};
    &:hover {
      opacity: 0.8;
    }
  }
`
const STYLED_RIGHT_CONTENT = styled.div`
  width: 77%;
  display: flex;
  &.connected {
    width: 64%;
  }
  .right-inner {
    flex-wrap: wrap;
    max-width: 720px;
    display: flex;
    margin-right: 0;
    margin-left: auto;
  }
`
const STYLED_SOL = styled.div`
  width: 300px;
  height: 60px;
  background-color: #111;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.margins['4x']};
  margin: 0 ${({ theme }) => theme.margins['1.5x']} ${({ theme }) => theme.margins['1x']};
  .value {
    font-family: Montserrat;
    font-size: 22px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #b1b1b1;
  }
  .text {
    font-family: Montserrat;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: #b1b1b1;
    display: flex;
  }
  .text-2 {
    margin-left: ${({ theme }) => theme.margins['1.5x']};
  }
`
const STYLED_STAKE_PILL = styled.div`
  width: 300px;
  height: 51px;
  border-radius: 51px;
  background-color: #1e1e1e;
  line-height: 49px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #b1b1b1;
  margin: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['1.5x']} 0;
`

const STYLED_STAKED_EARNED_CONTENT = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.margins['4x']};
  .info-item {
    max-width: 150px;
    min-width: 130px;
    margin-right: ${({ theme }) => theme.margins['7x']};

    .title,
    .value {
      font-family: Montserrat;
      font-size: 20px;
      font-weight: 600;
      color: #fff;
    }
    .price {
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.55);
    }
    .value,
    .price {
      margin-bottom: ${({ theme }) => theme.margins['0.5x']};
    }
  }
`

const STYLED_DESC = styled.div`
  display: flex;
  .text {
    margin-right: ${({ theme }) => theme.margins['1x']};
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
  .value {
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
`

export const ExpandedContent = ({ record }: any) => {
  const { connected } = record
  return (
    <STYLED_EXPANDED_ROW>
      <STYLED_EXPANDED_CONTENT>
        <STYLED_LEFT_CONTENT className={`${connected ? 'connected' : 'disconnected'}`}>
          <div className="left-inner">
            <img src={`${process.env.PUBLIC_URL}/img/assets/farm-logo.svg`} alt="" />
            {connected ? (
              <STYLED_STAKED_EARNED_CONTENT>
                {stakedEarnedMockData.map((item: any) => (
                  <div className="info-item" key={item?.id}>
                    <div className="title">{item?.title}</div>
                    <div className="value">{item?.value}</div>
                    <div className="price">{item?.price}</div>
                  </div>
                ))}
              </STYLED_STAKED_EARNED_CONTENT>
            ) : (
              <Button type="primary">
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </STYLED_LEFT_CONTENT>
        <STYLED_RIGHT_CONTENT className={`${connected ? 'connected' : 'disconnected'}`}>
          <div className="right-inner">
            {[0, 1, 2, 3].map((item) =>
              item < 2 ? (
                <STYLED_SOL>
                  <div className="value">0.00 SOL</div>
                  <div className="text">
                    <div className="text-1">Half</div>
                    <div className="text-2">Max</div>
                  </div>
                </STYLED_SOL>
              ) : (
                <STYLED_STAKE_PILL>{item === 2 ? 'Stake' : 'Unstake and claim'}</STYLED_STAKE_PILL>
              )
            )}
          </div>
        </STYLED_RIGHT_CONTENT>
      </STYLED_EXPANDED_CONTENT>
      {connected && (
        <STYLED_DESC>
          <div className="text">SOL Wallet Balance:</div>
          <div className="value">124.4589 SOL</div>
        </STYLED_DESC>
      )}
    </STYLED_EXPANDED_ROW>
  )
}
