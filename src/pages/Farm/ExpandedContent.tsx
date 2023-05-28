import React, { FC, useState, useMemo } from 'react'
import styled from 'styled-components'
import { MainButton } from '../../components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useFarmContext, useAccounts, useTokenRegistry } from '../../context'
import tw from 'twin.macro'
import { Loader } from '../Farm/Columns'
import { moneyFormatter } from '../../utils/math'
import { HeaderTooltip } from '../Farm/Columns'
import { Connect } from '../../layouts'

const STYLED_SOL = styled.div`
  ${tw`flex items-center justify-between rounded-[60px] h-12.5 w-[372px] w-[90%] my-[20px] mx-auto`}
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

const STYLED_STAKE_PILL = styled(MainButton)`
  ${tw`w-[90%] mt-0 mx-auto mb-5 h-12.5 text-base font-semibold rounded-circle bg-[#131313] text-center opacity-50`}
  line-height: normal;
  font-family: Montserrat;
  color: ${({ theme }) => theme.text14};
  transition: all 0.3s ease;
  &:hover,
  &:focus {
    background: ${({ theme }) => theme.primary3};
    ${tw`text-white opacity-100`}
    &:disabled {
      ${tw`opacity-50`}
    }
  }
`
const MAX_BUTTON = styled.div`
  ${tw`cursor-pointer`}
`

const EXPAND_WRAPPER = styled.div`
  ${tw`font-semibold text-base`}
  .details {
    font-family: Montserrat;
    line-height: normal;
    color: ${({ theme }) => theme.text1};
  }
`

const ROW = styled.div`
  ${tw`flex justify-between mb-3.5`}
`
const Tooltip_holder = styled.div`
  ${tw`flex`}
`
const ROW_WRAPPER = styled.div`
  ${tw`px-5 pt-5 pb-6`}
`

const STAKE_UNSTAKE = styled.div`
  ${tw`flex justify-center px-[2%]`}

  .selected {
    ${tw`text-white`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%) !important;
  }
`

const BUTTONS = styled.button`
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
  ${tw`flex flex-row justify-center`}
`

export const ExpandedContent: FC<{
  name: string
  stakeRef: any
  unstakeRef: any
  onClickHalf?: (x: string) => void
  onClickMax?: (x: string) => void
  onClickStake?: any
  onClickUnstake?: any
  onClickDeposit?: any
  onClickWithdraw?: any
  onClickMint?: any
  onClickBurn?: any
  isStakeLoading?: boolean
  isWithdrawLoading?: boolean
  isMintLoading?: boolean
  userSOLBalance?: number
  isBurnLoading?: boolean
  isUnstakeLoading?: boolean
  isSsl?: boolean
  withdrawClicked?: () => void
  rowData: any
}> = ({
  name,
  stakeRef,
  unstakeRef,
  onClickHalf,
  onClickMax,
  onClickStake,
  onClickUnstake,
  isStakeLoading,
  isUnstakeLoading,
  onClickDeposit,
  userSOLBalance,
  isWithdrawLoading,
  isSsl,
  withdrawClicked,
  rowData
}) => {
  const { farmDataContext, farmDataSSLContext } = useFarmContext()
  const { getUIAmount } = useAccounts()
  const { wallet } = useWallet()
  const { getTokenInfoForFarming } = useTokenRegistry()
  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, wallet?.adapter?.publicKey])
  const [process, setProcess] = useState<string>('Stake')
  const DISPLAY_DECIMAL = 3
  let userTokenBalance = useMemo(
    () => (wallet?.adapter?.publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo?.address, getUIAmount, wallet?.adapter?.publicKey]
  )
  const tokenData = !isSsl
    ? farmDataContext.find((token) => token.name === 'GOFX')
    : farmDataSSLContext.find((farmData) => farmData.name === name)

  const availableToMint =
    tokenData?.ptMinted >= 0 ? tokenData.currentlyStaked + tokenData.earned - tokenData.ptMinted : 0

  const onClickHalfSsl = (buttonId: string) => {
    if (name === 'SOL') userTokenBalance = userSOLBalance
    if (buttonId === 'deposit') stakeRef.current.value = (userTokenBalance / 2).toFixed(DISPLAY_DECIMAL)
    else unstakeRef.current.value = (availableToMint / 2).toFixed(DISPLAY_DECIMAL)
  }

  const onClickMaxSsl = (buttonId: string) => {
    if (name === 'SOL') userTokenBalance = userSOLBalance
    if (buttonId === 'deposit') stakeRef.current.value = userTokenBalance.toFixed(DISPLAY_DECIMAL)
    else unstakeRef.current.value = availableToMint.toFixed(DISPLAY_DECIMAL)
  }

  return (
    <>
      <EXPAND_WRAPPER>
        <ROW_WRAPPER>
          <ROW>
            <span className="details">Balance</span>
            <span className="details">
              {' '}
              {rowData?.currentlyStaked >= 0 ? ` ${moneyFormatter(rowData.currentlyStaked)}` : <Loader />}
            </span>
          </ROW>
          <ROW>
            <Tooltip_holder>
              <span className="details">Total Earned</span>
              <HeaderTooltip
                text={`The total profit and loss from SSL and is measured by comparing the total value of a pool’s 
                assets (excluding trading fees) to their value if they had not been traded and instead were just held`}
              />
            </Tooltip_holder>
            <span className="details">
              {' '}
              {rowData?.earned >= 0 ? `${moneyFormatter(rowData?.earned)}` : <Loader />}
            </span>
          </ROW>
          <ROW>
            <Tooltip_holder>
              <span className="details">Liquidity</span>
              <HeaderTooltip text="Total value of funds in this farm's liquidity pool." />
            </Tooltip_holder>
            <span className="details">
              {rowData?.liquidity >= 0 ? `$ ${moneyFormatter(rowData?.liquidity)}` : <Loader />}
            </span>
          </ROW>
          <ROW>
            <span className="details">7d Volume</span>
            <span className="details">
              {' '}
              {rowData?.volume === '-' ? (
                '-'
              ) : rowData.volume >= 0 ? (
                `$ ${moneyFormatter(rowData?.volume)}`
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
        {wallet?.adapter?.publicKey ? (
          <>
            <STAKE_UNSTAKE>
              <BUTTONS
                className={process === 'Stake' ? 'selected' : ''}
                onClick={() => {
                  setProcess('Stake')
                }}
              >
                Stake
              </BUTTONS>
              <BUTTONS
                className={process !== 'Stake' ? 'selected' : ''}
                onClick={() => {
                  setProcess('Claim')
                }}
              >
                Unstake and claim
              </BUTTONS>
            </STAKE_UNSTAKE>
            <STYLED_SOL>
              <STYLED_INPUT
                className="value"
                type="number"
                placeholder={`0.00 ${name}`}
                ref={process === 'Stake' ? stakeRef : unstakeRef}
              />
              {!isSsl ? (
                <div className="textMain">
                  <MAX_BUTTON
                    onClick={() => onClickHalf(process === 'Stake' ? 'stake' : 'unstake')}
                    className="textOne"
                  >
                    HALF
                  </MAX_BUTTON>
                  <MAX_BUTTON
                    onClick={() => onClickMax(process === 'Stake' ? 'stake' : 'unstake')}
                    className="textTwo"
                  >
                    MAX
                  </MAX_BUTTON>
                </div>
              ) : (
                <div className="textMain">
                  <MAX_BUTTON
                    onClick={() => onClickHalfSsl(process === 'Stake' ? 'deposit' : 'mint')}
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
            {!isSsl ? (
              <STYLED_STAKE_PILL
                loading={process === 'Stake' ? isStakeLoading : isUnstakeLoading}
                disabled={process === 'Stake' ? isStakeLoading : isUnstakeLoading}
                onClick={() => (process === 'Stake' ? onClickStake() : onClickUnstake())}
              >
                {process === 'Stake' ? 'Stake' : 'Unstake and Claim'}
              </STYLED_STAKE_PILL>
            ) : (
              <STYLED_STAKE_PILL
                loading={process === 'Stake' ? isStakeLoading : isWithdrawLoading}
                onClick={() => (process === 'Stake' ? onClickDeposit() : withdrawClicked())}
              >
                {process === 'Stake' ? 'Stake' : 'Unstake and Claim'}
              </STYLED_STAKE_PILL>
            )}
            {name === 'GOFX' ? <Reward>Daily rewards: {`${tokenData.rewards.toFixed(3)} ${name}`}</Reward> : ''}
          </>
        ) : (
          <ConnectWrapper>
            <Connect />
          </ConnectWrapper>
        )}
      </EXPAND_WRAPPER>
    </>
  )
}
