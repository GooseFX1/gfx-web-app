import React, { useState } from 'react'
import { stakedEarnedMockData, messageMockData, stakeOrClaimInfoMockData } from './mockData'
import styled from 'styled-components'
import { Button, Row, Col } from 'antd'
import { MainButton } from '../../components'
import { notify } from '../../utils'

const STYLED_EXPANDED_ROW = styled.div`
  padding-top: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(10)};
  padding-bottom: ${({ theme }) => theme.margin(7)};
  padding-left: ${({ theme }) => theme.margin(4)};
  background-image: ${({ theme }) => theme.expendedRowBg};
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
    margin-left: ${({ theme }) => theme.margin(4)};
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
    display: flex;
    margin-right: 0;
    margin-left: auto;
  }
`
const STYLED_SOL = styled.div`
  width: 300px;
  height: 60px;
  background-color: ${({ theme }) => theme.solPillBg};
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.margin(4)};
  margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)};
  .value {
    font-family: Montserrat;
    font-size: 22px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: ${({ theme }) => theme.text15};
  }
  &.active {
    .value {
      color: #fff;
      font-weight: 600;
    }
  }
  .text {
    font-family: Montserrat;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: ${({ theme }) => theme.text14};
    display: flex;
  }
  .text-2 {
    margin-left: ${({ theme }) => theme.margin(1.5)};
  }
`
const STYLED_STAKE_PILL = styled(MainButton)`
  width: 300px;
  height: 51px;
  border-radius: 51px;
  background-color: ${({ theme }) => theme.stakePillBg};
  line-height: 49px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.text14};
  margin: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(1.5)} 0;
  transition: all 0.3s ease;
  cursor: pointer;
  &.active,
  &:hover {
    background: #050505;
    color: #fff;
  }
`

const STYLED_STAKED_EARNED_CONTENT = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.margin(4)};
  .info-item {
    max-width: 150px;
    min-width: 130px;
    margin-right: ${({ theme }) => theme.margin(7)};
    .title,
    .value {
      font-family: Montserrat;
      font-size: 20px;
      font-weight: 600;
      color: ${({ theme }) => theme.text7};
    }
    .price {
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 500;
      color: ${({ theme }) => theme.text13};
    }
    .value,
    .price {
      margin-bottom: ${({ theme }) => theme.margin(0.5)};
    }
  }
`

const STYLED_DESC = styled.div`
  display: flex;
  .text {
    margin-right: ${({ theme }) => theme.margin(1)};
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text7};
  }
  .value {
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    color: ${({ theme }) => theme.text8};
  }
`

const MESSAGE = styled.div`
  margin: -12px 0;
  font-size: 12px;
  font-weight: 700;

  .m-title {
    margin-bottom: 16px;
  }

  .m-icon {
    width: 20.5px;
    height: 20px;
  }

  p {
    line-height: 1.3;
    max-width: 200px;
  }
`

export const ExpandedContent = ({ record }: any) => {
  const { connected } = record
  const initState = [
    {
      id: 0,
      selected: false,
      isLoading: false
    },
    {
      id: 1,
      selected: false,
      isLoading: false
    }
  ]
  const [status, setStatus] = useState(initState)
  const [count, setCount] = useState(0)
  const onClickStake = (index) => {
    const tmp = JSON.parse(JSON.stringify(status))
    if (!tmp[index].selected) {
      tmp[index].selected = true
      setStatus(tmp)
      return
    }
    const _count = count + 1
    setCount(_count)
    tmp[index].isLoading = true
    setStatus(tmp)
    const type = _count % 2 === 0 ? 'info' : 'error'
    setTimeout(() => {
      const temp = JSON.parse(JSON.stringify(status))
      temp[index].isLoading = false
      setStatus(temp)
      notify({
        message: (
          <MESSAGE>
            <Row className="m-title" justify="space-between" align="middle">
              <Col>{messageMockData[index][type].title}</Col>
              <Col>
                <img className="m-icon" src={`/img/assets/${messageMockData[index][type].icon}.svg`} alt="" />
              </Col>
            </Row>
            {type === 'info' ? (
              <>
                <div>{messageMockData[index][type]?.text1}</div>
                <div>{messageMockData[index][type]?.text2}</div>
                <div>{messageMockData[index][type]?.text3}</div>
              </>
            ) : (
              <p>{messageMockData[index][type]?.text1}</p>
            )}
          </MESSAGE>
        ),
        styles: {
          maxWidth: '270px',
          minWidth: '220px'
        },
        type
      })
    }, 1000)
  }
  return (
    <STYLED_EXPANDED_ROW>
      <STYLED_EXPANDED_CONTENT>
        <STYLED_LEFT_CONTENT className={`${connected ? 'connected' : 'disconnected'}`}>
          <div className="left-inner">
            <img src={`/img/assets/farm-logo.svg`} alt="" />
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
            {stakeOrClaimInfoMockData.map((item) => (
              <div className="SOL-item">
                <STYLED_SOL className={status[item.id].selected ? 'active' : ''}>
                  <div className="value">{item.value}</div>
                  <div className="text">
                    <div className="text-1">Half</div>
                    <div className="text-2">Max</div>
                  </div>
                </STYLED_SOL>
                <STYLED_STAKE_PILL
                  className={status[item.id].selected ? 'active' : ''}
                  loading={status[item.id].isLoading}
                  disabled={status[item.id].isLoading}
                  onClick={() => onClickStake(item.id)}
                >
                  {item.action}
                </STYLED_STAKE_PILL>
              </div>
            ))}
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
