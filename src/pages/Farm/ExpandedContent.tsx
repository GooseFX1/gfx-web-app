import React, { FC, useState, useMemo} from "react";
import styled  from "styled-components";
import { MainButton } from '../../components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useFarmContext, usePriceFeedFarm, useAccounts, useTokenRegistry } from '../../context'
import tw from "twin.macro"
import { Loader } from '../Farm/Columns'
import { moneyFormatter, percentFormatter } from '../../utils/math'
import { HeaderTooltip } from "../Farm/Columns"

const STYLED_SOL = styled.div`
  ${tw`flex items-center justify-between rounded-[60px] h-[50px] w-[372px] sm:w-[90%] sm:my-[20px] sm:mx-auto`}

  @media(max-width: 500px){
    background-color: ${({ theme }) => theme.solPillBg};
  }

  .value {
    ${tw`text-average font-medium text-center`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text15};
    @media(max-width: 500px){
      color: #b5b5b5;
      text-align: left;
      font-size: 18px;
      font-weight: 600;
    }
  }
  &.active {
    .value {
      ${tw`text-white font-semibold`}
    }
  }
  .textMain {
    ${tw`text-tiny font-semibold text-center flex z-[2] mb-1.5 ml-[--100px] sm:p-[5%] sm:m-0`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text14};
  }
  .textTwo {
    ${tw`ml-3`}
  }
`
const STYLED_INPUT = styled.input`
  ${tw`flex items-center justify-between rounded-[60px] h-[44px] w-[372px] my-3 mx-2 py-0 px-8 sm:h-full sm:w-[70%] sm:m-0 sm:p-[5%] sm: block`}
  background-color: ${({ theme }) => theme.solPillBg};
  border: none;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media(max-width: 500px){
    border: none;
    outline: none;
  }
  .value {
    ${tw`text-average font-medium text-center sm:text-left`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text15};
    color: #b5b5b5;
  }
  &.active {
    .value {
      ${tw`font-semibold`}
    }
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

const STYLED_BUTTON = styled.button`
    ${tw`w-[65px] h-10 rounded-[50px] font-semibold text-center`}
    border: none;
`

const STYLED_STAKE_PILL = styled(MainButton)`
  ${tw`w-[372px] h-[44px] text-[14px] font-semibold cursor-pointer rounded-circle text-center leading-[49px] opacity-50`}
  background-color: ${({ theme }) => theme.stakePillBg};
  font-family: Montserrat;
  color: ${({ theme }) => theme.text14};
  margin: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(1.5)} 0;
  transition: all 0.3s ease;
  &.active,
  &:hover,
  &:focus {
    background: ${({ theme }) => theme.primary3};
    ${tw`text-white opacity-100`}
    &:disabled {
      ${tw`opacity-50`}
    }
  }
  @media(max-width: 500px){
    ${tw`w-[90%] mt-0 mx-auto h-12.5`}
    opacity: 0.5;
    font-size: 16px;
    color: #b5b5b5;
    margin-bottom: 20px;
    background: #131313;
    &:focus {
      background-color: ${({ theme }) => theme.stakePillBg}; 
      color: #fff;
  }
  &.miniButtons {
  }
`
const MAX_BUTTON = styled.div`
  cursor: pointer;
`

const EXPAND_WRAPPER = styled.div`
  .details{
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }
`

const ROW = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
`
const Tooltip_holder=styled.div`
  display: flex;
`
const ROW_WRAPPER = styled.div`
  padding: 20px 20px 24px 20px;
`

const STAKE_UNSTAKE = styled.div`
  display: flex;
  justify-content: center;

  .selected{
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%) !important;
    color: white;
  }
`

const BUTTONS = styled.button`
  width: 168px;
  height: 40px;
  border-radius: 36px;
  border: none;
  font-family: 'Montserrat';
  font-weight: 600;
  font-size: 15px;
  color: #b5b5b5;
  text-align: center;
  cursor: pointer;
  background: none;
  :disabled {
    cursor: wait;
  }
`

const STAKE = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 25%;
  margin-top: 15px;
  margin-bottom: 20px;
`
const EARN = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  margin-bottom: 20px;
`

const Reward = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: #eee;
`

export const ExpandedContent: FC<{
    wallet: any
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
    wallet,
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
    const { farmDataContext, farmDataSSLContext, operationPending } = useFarmContext()
    const { prices } = usePriceFeedFarm()
    const { getUIAmount } = useAccounts()
    const { publicKey } = useWallet()
    const { getTokenInfoForFarming } = useTokenRegistry()
    const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey])
    const [process, setProcess] = useState<String>("Stake");
    const DISPLAY_DECIMAL = 3
    let userTokenBalance = useMemo(
        () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
        [tokenInfo?.address, getUIAmount, publicKey]
      )
    const tokenData = !isSsl ? farmDataContext.find((token) => token.name === 'GOFX') 
                      : farmDataSSLContext.find((farmData) => farmData.name === name)


    let tokenPrice = useMemo(() => {
      if (name === 'USDC') {
        return { current: 1 }
      }
      // to get price of the token MSOL must be in upper case while to get tokenInfo address mSOL
      return prices[`${name.toUpperCase()}/USDC`]
    }, [prices[`${name.toUpperCase()}/USDC`]])

    const availableToMint =
    tokenData?.ptMinted >= 0 ? tokenData.currentlyStaked + tokenData.earned - tokenData.ptMinted : 0
    const availableToMintFiat = tokenPrice && availableToMint * tokenPrice.current

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

    let notEnough
    try {
      let amt = parseFloat(stakeRef.current?.value).toFixed(3)
      notEnough =
        parseFloat(amt) >
        (name === 'SOL' ? parseFloat(userSOLBalance.toFixed(3)) : parseFloat(userTokenBalance.toFixed(3)))
    } catch (e) {}
    
    return(
    <>
     <EXPAND_WRAPPER>
       <ROW_WRAPPER>
          <ROW>
              <span className="details">Balance</span>
              <span className="details"> {rowData?.currentlyStaked >= 0 ? ` ${moneyFormatter(rowData.currentlyStaked)}` : <Loader />}</span>
          </ROW>
          <ROW>
            <Tooltip_holder>
              <span className="details">Total Earned</span>
              {HeaderTooltip("The total profit and loss from SSL and is measured by comparing the total value of a pool’s assets (excluding trading fees) to their value if they had not been traded and instead were just held")}
            </Tooltip_holder>
              <span className="details"> {rowData?.earned >= 0 ? `${moneyFormatter(rowData?.earned)}` : <Loader />}</span>
          </ROW>
          <ROW>
            <Tooltip_holder>
              <span className="details">Liquidity</span>
              {HeaderTooltip("Total value of funds in this farm's liquidity pool.")}
            </Tooltip_holder>
              <span className="details">{rowData?.liquidity >= 0 ? `$ ${moneyFormatter(rowData?.liquidity)}` : <Loader />}</span>
          </ROW>
          <ROW>
              <span className="details">7d Volume</span>
              <span className="details"> {rowData?.volume === '-' ? '-' : rowData.volume >= 0 ? `$ ${moneyFormatter(rowData?.volume)}` : <Loader />}</span>
          </ROW>
          <ROW>
              <span className="details">{name} Wallet Balance:</span>
              <span className="details">{userTokenBalance?.toFixed(3)}</span>
          </ROW>
       </ROW_WRAPPER>
       <STAKE_UNSTAKE>
            <BUTTONS 
              className={process === 'Stake' ? 'selected' : ''}
              onClick={()=>{setProcess('Stake')}}
              >
                Stake
            </BUTTONS>
            <BUTTONS 
              className={process !== 'Stake' ? 'selected' : ''}
              onClick={()=>{setProcess('Claim')}}
              >
                Unstake and claim
            </BUTTONS>
       </STAKE_UNSTAKE>
       <STYLED_SOL>
          <STYLED_INPUT className="value" type="number" placeholder={`0.00 ${name}`} ref={process==='Stake' ? stakeRef : unstakeRef} />
          {!isSsl ? 
          (<div className="textMain">
            <MAX_BUTTON onClick={() => onClickHalf(process==='Stake' ? 'stake': 'unstake')} className="textOne">
              HALF
            </MAX_BUTTON>
            <MAX_BUTTON onClick={() => onClickMax(process==='Stake' ? 'stake': 'unstake')} className="textTwo">
              MAX
            </MAX_BUTTON>
            </div>
            ) : (<div className="textMain">
            <MAX_BUTTON onClick={() => onClickHalfSsl(process==='Stake' ? 'deposit': 'mint')} className="textOne">
              HALF
            </MAX_BUTTON>
            <MAX_BUTTON onClick={() => onClickMaxSsl(process==='Stake' ? 'deposit': 'mint')} className="textTwo">
              MAX
            </MAX_BUTTON>
            </div>
            )}
        </STYLED_SOL>
        {!isSsl ?
          <STYLED_STAKE_PILL
              loading={process==='Stake' ? isStakeLoading : isUnstakeLoading}
              disabled={process==='Stake' ? isStakeLoading : isUnstakeLoading}
              onClick={() => process==='Stake' ? onClickStake() : onClickUnstake()}
          >
          {process === 'Stake' ? 'Stake' : 'Unstake and Claim'}
        </STYLED_STAKE_PILL> 
        :
        <STYLED_STAKE_PILL
          loading={process==='Stake' ? isStakeLoading : isWithdrawLoading}
          // disabled={process==='Stake' ?
          //     isStakeLoading || notEnough
          //   : isUnstakeLoading || parseFloat(availableToMint.toFixed(DISPLAY_DECIMAL)) <= 0 || operationPending
          // }
            onClick={() => process==='Stake' ? onClickDeposit() : withdrawClicked()}
        >
          {process === 'Stake' ? 'Stake' : 'Unstake and Claim'}
        </STYLED_STAKE_PILL>
      }
      {name==="GOFX" ? (
      <Reward>
        Daily rewards: {`${tokenData.rewards.toFixed(3)} ${name}`}
      </Reward>) : ""
      }
     </EXPAND_WRAPPER>
    </>
    )
 }

 