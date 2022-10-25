import React, { FC, useState, useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'
import { MainButton } from '../../components'

import { useWallet } from '@solana/wallet-adapter-react'
import { useFarmContext, useAccounts, useTokenRegistry } from '../../context'
import tw from 'twin.macro'
import { Loader } from '../Farm/Columns'
import { moneyFormatter } from '../../utils/math'
import { HeaderTooltip } from '../Farm/Columns'
import { Connect } from '../../layouts/App/Connect'
import { IFarmData } from './CustomTableList'

const STYLED_SOL = styled.div`
  ${tw`flex items-center justify-between rounded-[60px] h-11 w-[372px] w-[90%] my-[15px] mx-auto`}
  background-color: ${({ theme }) => theme.solPillBg};

  .value {
    ${tw`text-left font-semibold text-[18px]`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text15};
  }
  .textMain {
    ${tw`text-tiny font-semibold text-center flex z-[2] p-[5%] m-0`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text14};
  }
  .textTwo {
    ${tw`ml-3`}
  }
`
const STYLED_INPUT = styled.input`
  ${tw`rounded-[60px] h-full w-[70%] m-0 p-[5%] border-0 border-none outline-none`}
  background-color: ${({ theme }) => theme.solPillBg};
  border: none;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .textMain {
    ${tw`text-tiny font-semibold text-center flex`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text14};
  }
  .textTwo {
    ${tw`ml-3`}
  }
`

const STYLED_BTN = styled(MainButton)`
  ${tw`w-[90%] mt-0 mx-auto mb-2.5 h-11 text-base font-semibold rounded-circle bg-[#131313] text-center`}
  line-height: normal;
  font-family: Montserrat;
  color: ${({ theme }) => theme.text14};
  transition: all 0.3s ease;
  opacity: 0.65;
  border: 2px solid;
  &:focus {
    background: ${({ theme }) => theme.primary3};
    ${tw`text-white opacity-100`}
    &:disabled {
      ${tw`opacity-50`}
    }
  }
  &:focus,
  &.active {
    ${tw`opacity-100 text-white`}
    background: ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 0.5;
    border: none;
  }
`
const MAX_BUTTON = styled.div`
  ${tw`cursor-pointer`}
`

const EXPAND_WRAPPER = styled.td<{ publicKey: any }>`
  ${({ publicKey }) => css`
    ${tw`font-semibold text-base absolute w-full left-0`}
    margin-top: -395px;
    width: ${publicKey ? '100%' : '200px'};
    margin-left: ${!publicKey && '30%'};
    .details {
      font-family: Montserrat;
      line-height: normal;
      color: ${({ theme }) => theme.text1};
    }
  `}
`

const ROW = styled.div`
  ${tw`flex justify-between mb-3.5`}
`
const Tooltip_holder = styled.div`
  ${tw`flex`}
`
const ROW_WRAPPER = styled.div`
  ${tw`px-5 pb-5`}
`

const STAKE_UNSTAKE = styled.div`
  ${tw`flex justify-center px-[2%]`}

  .selected {
    ${tw`text-white`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%) !important;
  }
`

const OPERATION_BTN = styled.button`
  ${tw`w-1/2 h-10 rounded-[36px] border-0 border-none 
  font-semibold text-tiny text-[#b5b5b5] text-center cursor-pointer`}
  font-family: 'Montserrat';
  background: none;
  :disabled {
    cursor: wait;
  }
`

const Reward = styled.div`
  ${tw`text-center font-semibold text-tiny`}
  font-family: Montserrat;
  color: ${({ theme }) => theme.text1};
`
const ConnectWrapper = styled.div`
  ${tw`flex flex-row justify-center mt-[260px] w-9/12`}
`

export const ExpandedContentMobile: FC<{
  onClickHalf?: (x: string) => void
  onClickMax?: (x: string) => void
  onClickStake?: any
  onClickUnstake?: any
  onClickDeposit?: any
  onClickWithdraw?: any
  isStakeLoading: boolean
  isWithdrawLoading?: boolean
  isUnstakeLoading: boolean
  userSOLBalance?: number
  stakeAmt: number
  setStakeAmt: any
  setUnstakeAmt: any
  unstakeAmt: number
  withdrawClicked: () => void
  farm: IFarmData
  notEnoughFunds: boolean
  depositBtnClass: string
  setDepositClass: any
  zeroFunds: boolean
}> = ({
  onClickHalf,
  onClickMax,
  onClickStake,
  onClickUnstake,
  isStakeLoading,
  isUnstakeLoading,
  onClickDeposit,
  withdrawClicked,
  userSOLBalance,
  setStakeAmt,
  stakeAmt,
  setUnstakeAmt,
  unstakeAmt,
  notEnoughFunds,
  depositBtnClass,
  setDepositClass,
  farm,
  zeroFunds
}) => {
  const { farmDataContext, farmDataSSLContext } = useFarmContext()
  //const { prices } = usePriceFeedFarm()
  const wallet = useWallet()
  const { name, currentlyStaked, earned } = farm
  const isSSL = farm.type === 'SSL'
  const { getUIAmount } = useAccounts()
  const { publicKey } = useWallet()
  const { getTokenInfoForFarming } = useTokenRegistry()
  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey])
  const [process, setProcess] = useState<string>('Stake')
  const DISPLAY_DECIMAL = 3
  let userTokenBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo?.address, getUIAmount, publicKey]
  )
  const tokenData = !isSSL
    ? farmDataContext.find((token) => token.name === 'GOFX')
    : farmDataSSLContext.find((farmData) => farmData.name === name)

  const availableToMint =
    tokenData?.ptMinted >= 0 ? tokenData.currentlyStaked + tokenData.earned - tokenData.ptMinted : 0

  const onClickHalfSsl = (buttonId: string) => {
    //@ts-ignore
    inputRef?.current && inputRef?.current?.focus()
    if (name === 'SOL') userTokenBalance = userSOLBalance
    if (buttonId === 'deposit') setStakeAmt(parseFloat((userTokenBalance / 2).toFixed(DISPLAY_DECIMAL)))
    if (buttonId === 'stake') setStakeAmt(parseFloat(((currentlyStaked + earned) / 2).toFixed(DISPLAY_DECIMAL)))
    else setUnstakeAmt(parseFloat((availableToMint / 2).toFixed(DISPLAY_DECIMAL)))
  }

  const onClickMaxSsl = (buttonId: string) => {
    //@ts-ignore
    inputRef?.current && inputRef?.current?.focus()
    if (name === 'SOL') userTokenBalance = userSOLBalance
    if (buttonId === 'deposit') setStakeAmt(parseFloat(userTokenBalance.toFixed(DISPLAY_DECIMAL)))
    if (buttonId === 'stake') setStakeAmt(parseFloat((currentlyStaked + earned).toFixed(DISPLAY_DECIMAL)))
    else setUnstakeAmt(parseFloat(availableToMint.toFixed(DISPLAY_DECIMAL)))
  }
  const stakeProcess = process === 'Stake'
  const inputRef = useRef()
  const gofxBtnDisabled = stakeProcess
    ? isStakeLoading || notEnoughFunds
    : isUnstakeLoading || currentlyStaked + earned <= 0
  const SSLDisabledBtn = stakeProcess ? isStakeLoading || notEnoughFunds || zeroFunds : !availableToMint

  return (
    <EXPAND_WRAPPER publicKey={wallet.publicKey}>
      {wallet.publicKey ? (
        <>
          <ROW_WRAPPER>
            <ROW>
              <span className="details">Balance</span>
              <span className="details">
                {' '}
                {farm?.currentlyStaked !== undefined ? ` ${moneyFormatter(farm.currentlyStaked)}` : <Loader />}
              </span>
            </ROW>
            <ROW>
              <Tooltip_holder>
                <span className="details">Total Earned</span>
                {HeaderTooltip(
                  `The total profit and loss from SSL and is measured by comparing the total 
                    value of a pool’s assets (
                  excluding trading fees) to their value if they had not been traded and instead were just held`
                )}
              </Tooltip_holder>
              <span className="details">
                {' '}
                {farm?.earned !== undefined ? `${moneyFormatter(farm?.earned)}` : <Loader />}
              </span>
            </ROW>
            <ROW>
              <Tooltip_holder>
                <span className="details">Liquidity</span>
                {HeaderTooltip("Total value of funds in this farm's liquidity pool.")}
              </Tooltip_holder>
              <span className="details">
                {farm?.liquidity >= 0 ? `$ ${moneyFormatter(farm?.liquidity)}` : <Loader />}
              </span>
            </ROW>
            <ROW>
              <span className="details">7d Volume</span>
              <span className="details">
                {' '}
                {farm?.volume === '-' ? (
                  '-'
                ) : farm.volume >= 0 ? (
                  //@ts-ignore
                  `$ ${moneyFormatter(farm?.volume)}`
                ) : (
                  <Loader />
                )}
              </span>
            </ROW>
            <ROW>
              <span className="details">{name} Wallet Balance:</span>
              <span className="details">{userTokenBalance?.toFixed(3)}</span>
            </ROW>
          </ROW_WRAPPER>
          <>
            <STAKE_UNSTAKE>
              <OPERATION_BTN
                className={process === 'Stake' ? 'selected' : ''}
                onClick={() => {
                  setProcess('Stake')
                }}
              >
                Deposit
              </OPERATION_BTN>
              <OPERATION_BTN
                className={process !== 'Stake' ? 'selected' : ''}
                onClick={() => {
                  setProcess('Claim')
                }}
              >
                {isSSL ? 'Withdraw' : 'Unstake and claim'}
              </OPERATION_BTN>
            </STAKE_UNSTAKE>
            <STYLED_SOL>
              <STYLED_INPUT
                ref={inputRef}
                onFocus={() => (isSSL ? !SSLDisabledBtn : !gofxBtnDisabled) && setDepositClass(' active')}
                onBlur={() => setDepositClass('')}
                value={stakeProcess ? stakeAmt : unstakeAmt}
                onChange={(e) =>
                  stakeProcess
                    ? setStakeAmt(parseFloat(e.target.value))
                    : setUnstakeAmt(parseFloat(e.target.value))
                }
                className="value"
                type="number"
                placeholder={`0.00 ${name}`}
              />
              {!isSSL ? (
                <div className="textMain">
                  <MAX_BUTTON
                    onClick={() => {
                      //@ts-ignore
                      inputRef?.current && inputRef?.current.focus()
                      onClickHalf(process === 'Stake' ? 'stake' : 'unstake')
                    }}
                    className="textOne"
                  >
                    HALF
                  </MAX_BUTTON>
                  <MAX_BUTTON
                    onClick={() => {
                      //@ts-ignore
                      inputRef?.current && inputRef?.current.focus()
                      onClickMax(process === 'Stake' ? 'stake' : 'unstake')
                    }}
                    className="textTwo"
                  >
                    MAX
                  </MAX_BUTTON>
                </div>
              ) : (
                <div className="textMain">
                  <MAX_BUTTON
                    onClick={() => onClickHalfSsl(stakeProcess ? 'deposit' : 'mint')}
                    className="textOne"
                  >
                    HALF
                  </MAX_BUTTON>
                  <MAX_BUTTON
                    onClick={() => onClickMaxSsl(process === 'Stake' ? 'deposit' : 'mint')}
                    className="textTwo"
                  >
                    MAX
                  </MAX_BUTTON>
                </div>
              )}
            </STYLED_SOL>
            {!isSSL ? (
              <STYLED_BTN
                className={depositBtnClass}
                loading={process === 'Stake' ? isStakeLoading : isUnstakeLoading}
                disabled={gofxBtnDisabled}
                onClick={() => (process === 'Stake' ? onClickStake() : onClickUnstake())}
              >
                {stakeProcess ? (notEnoughFunds ? `Not enough ${name}` : 'Deposit') : 'Unstake and Claim'}
              </STYLED_BTN>
            ) : (
              <STYLED_BTN
                className={depositBtnClass}
                disabled={SSLDisabledBtn}
                loading={stakeProcess ? isStakeLoading : isUnstakeLoading}
                onClick={() => (stakeProcess ? onClickDeposit() : withdrawClicked())}
              >
                {stakeProcess
                  ? notEnoughFunds || zeroFunds
                    ? `Not enough ${name}`
                    : 'Deposit'
                  : !availableToMint
                  ? 'No funds to withdraw'
                  : 'Withdraw'}
              </STYLED_BTN>
            )}
            {name === 'GOFX' ? <Reward>Daily rewards: {`${tokenData.rewards.toFixed(3)} ${name}`}</Reward> : ''}
          </>
        </>
      ) : (
        <ConnectWrapper>
          <Connect />
        </ConnectWrapper>
      )}
    </EXPAND_WRAPPER>
  )
}
