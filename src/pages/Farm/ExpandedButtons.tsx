import React, { FC, ReactElement } from 'react'
import { MainButton } from '../../components'
import { Connect } from '../../layouts/App/Connect'
import styled from 'styled-components'
import { WalletContextState } from '@solana/wallet-adapter-react'

const STYLED_RIGHT_CONTENT = styled.div`
  display: flex;
  &.connected {
    width: 55%;
  }
  .right-inner {
    display: flex;
    margin-right: 0;
    margin-left: auto;
  }
`
const FLEX = styled.div`
  display: flex;
  width: 392px;
`

const STYLED_SOL = styled.div`
  width: 372px;
  height: 60px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding: 0 ${({ theme }) => theme.margin(4)};
  margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)}; */
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
    z-index: 2;
    margin-bottom: 6px;
    margin-left: -100px;
  }
  .text-2 {
    margin-left: ${({ theme }) => theme.margin(1.5)};
  }
`
const STYLED_INPUT = styled.input`
  width: 372px;
  height: 44px;
  background-color: ${({ theme }) => theme.solPillBg};
  border-radius: 60px;
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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
const STYLED_STAKED_EARNED_CONTENT = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.margin(3)};
  .info-item {
    min-width: 170px;
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
const STYLED_LEFT_CONTENT = styled.div`
  width: 25%;
  &.connected {
    width: 25%;
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
const STYLED_STAKE_PILL = styled(MainButton)`
  width: 372px;
  height: 44px;
  border-radius: 51px;
  background-color: ${({ theme }) => theme.stakePillBg};
  line-height: 49px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  opacity: 0.5;
  color: ${({ theme }) => theme.text14};
  margin: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(1.5)} 0;
  transition: all 0.3s ease;
  cursor: pointer;
  &.active,
  &:hover {
    background: #3735bb;
    color: #fff;
    opacity: 1;
  }
  &.miniButtons {
    width: 125px;
  }
`
const MAX_BUTTON = styled.div`
  cursor: pointer;
`
const STYLED_MINT = styled(MainButton)``

export const StakeButtons: FC<{
  wallet: any
  name: string
  stakeRef: any
  unstakeRef: any
  onClickHalf: (x: string) => void
  onClickMax: (x: string) => void
  onClickStake: any
  onClickUnstake: any
  isStakeLoading?: any
  isUnstakeLoading?: any
}> = ({
  wallet,
  name,
  stakeRef,
  unstakeRef,
  onClickHalf,
  onClickMax,
  onClickStake,
  onClickUnstake,
  isStakeLoading,
  isUnstakeLoading
}) => {
  return (
    <>
      <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
        <div className="left-inner">
          <STYLED_STAKED_EARNED_CONTENT>
            <div className="info-item">
              <div className="title">Daily Rewards</div>
              <div className="value">{`${1} ${name}`}</div>
              <div className="price">{`$${1} USDC`}</div>
            </div>
          </STYLED_STAKED_EARNED_CONTENT>
        </div>
      </STYLED_LEFT_CONTENT>
      <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
        <div className="right-inner">
          <div className="SOL-item">
            <STYLED_SOL>
              <STYLED_INPUT className="value" type="number" ref={stakeRef} />
              <div className="text">
                <MAX_BUTTON onClick={() => onClickHalf('stake')} className="text-1">
                  Half
                </MAX_BUTTON>
                <MAX_BUTTON onClick={() => onClickMax('stake')} className="text-2">
                  Max
                </MAX_BUTTON>
              </div>
            </STYLED_SOL>
            <STYLED_STAKE_PILL loading={isStakeLoading} disabled={isStakeLoading} onClick={() => onClickStake()}>
              Stake
            </STYLED_STAKE_PILL>
          </div>

          <div className="SOL-item">
            <STYLED_SOL>
              <STYLED_INPUT className="value" type="number" min="0" max="100" ref={unstakeRef} />
              <div className="text">
                <MAX_BUTTON onClick={() => onClickHalf('unstake')} className="text-1">
                  Half
                </MAX_BUTTON>
                <MAX_BUTTON onClick={() => onClickMax('unstake')} className="text-2">
                  Max
                </MAX_BUTTON>
              </div>
            </STYLED_SOL>
            <STYLED_STAKE_PILL loading={isUnstakeLoading} disabled={isUnstakeLoading} onClick={() => onClickUnstake()}>
              Unstake and Claim
            </STYLED_STAKE_PILL>
          </div>
        </div>
      </STYLED_RIGHT_CONTENT>
    </>
  )
}

export const SSLButtons: FC<{
  wallet: any
  name: string
  onClickHalf: (x: string) => void
  onClickMax: (x: string) => void
  stakeRef: any
  unstakeRef: any
  onClickStake: any
  onClickUnstake: any
  isStakeLoading?: any
  isUnstakeLoading?: any
}> = ({
  wallet,
  name,
  onClickHalf,
  onClickMax,
  stakeRef,
  unstakeRef,
  onClickStake,
  onClickUnstake,
  isStakeLoading,
  isUnstakeLoading
}) => {
  const miniButtonsClass = document.activeElement === unstakeRef.current ? 'miniButtons active' : 'miniButtons'
  return (
    <>
      <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
        <div className="left-inner">
          <STYLED_STAKED_EARNED_CONTENT>
            <div className="info-item">
              <div className="title">Available to mint</div>
              <div className="value">{`${1} ${name}`}</div>
              <div className="price">{`$${1} USDC`}</div>
            </div>
          </STYLED_STAKED_EARNED_CONTENT>
        </div>
      </STYLED_LEFT_CONTENT>
      <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
        <div className="right-inner">
          <div className="SOL-item">
            <STYLED_SOL>
              <STYLED_INPUT className="value" type="number" ref={stakeRef} />
              <div className="text">
                <MAX_BUTTON onClick={() => onClickHalf('stake')} className="text-1">
                  Half
                </MAX_BUTTON>
                <MAX_BUTTON onClick={() => onClickMax('stake')} className="text-2">
                  Max
                </MAX_BUTTON>
              </div>
            </STYLED_SOL>
            <STYLED_STAKE_PILL loading={isStakeLoading} disabled={isStakeLoading} onClick={() => onClickStake()}>
              Deposit
            </STYLED_STAKE_PILL>
          </div>
          <div className="SOL-item">
            <STYLED_SOL>
              <STYLED_INPUT className="value" type="number" min="0" max="100" ref={unstakeRef} />
              <div className="text">
                <MAX_BUTTON onClick={() => onClickHalf('unstake')} className="text-1">
                  Half
                </MAX_BUTTON>
                <MAX_BUTTON onClick={() => onClickMax('unstake')} className="text-2">
                  Max
                </MAX_BUTTON>
              </div>
            </STYLED_SOL>
            <FLEX>
              <STYLED_STAKE_PILL className={miniButtonsClass} onClick={() => onClickUnstake()}>
                Mint
              </STYLED_STAKE_PILL>
              <STYLED_STAKE_PILL className={miniButtonsClass} onClick={() => onClickUnstake()}>
                Burn
              </STYLED_STAKE_PILL>
              <STYLED_STAKE_PILL className={miniButtonsClass} onClick={() => onClickUnstake()}>
                Withdraw
              </STYLED_STAKE_PILL>
            </FLEX>
          </div>
        </div>
      </STYLED_RIGHT_CONTENT>
    </>
  )
}

export default {}
