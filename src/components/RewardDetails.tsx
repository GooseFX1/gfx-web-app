import React, { FC, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
// import Close from "/img/assets/close-white-icon.svg";
import { useHistory } from 'react-router-dom'
import { Row, Col } from 'antd'
import { useRewardToggle } from '../context/reward_toggle'
import { fetchRewardsByAddress } from '../api/NFTs'
import { SpaceEvenlyDiv } from '../styles'
import tw from 'twin.macro'

const REWARD_INFO_TEXT = styled.div`
  ${tw`py-8 px-10`}
  color: ${({ theme }) => theme.text1} !important;
`

const TEXT_20 = styled.div`
  ${tw`text-xl font-bold xl:text-tiny`}
  line-height: inherit;
  color: ${({ theme }) => theme.text1} !important;
`
const TEXT_50 = styled.span`
  ${tw`text-[50px] font-bold xl:text-[40px]`}
`

const TEXT_60 = styled.span`
  ${tw`text-6xl font-bold xl:text-[40px]`}
  font-family: Montserrat;
  line-height: normal;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`

const PURPLE60 = styled(TEXT_60)`
  background-image: linear-gradient(56deg, #716fff 20%, #e95aff 55%);
`

const TEXT_25 = styled.span`
  ${tw`text-[25px] font-semibold xl:text-[20px]`}
`

const TEXT_22 = styled.div`
  ${tw`text-average mt-[3vh] font-medium xl:text-regular`}
`

const TEXT_15 = styled.div`
  ${tw`text-tiny xl:text-[12px]`}
  color: ${({ theme }) => theme.text16};
`

const GREEN60 = styled(TEXT_60)`
  background-image: linear-gradient(264deg, #9cc034 56%, #49821c 99%);
`

const REWARD_DETAILS_CONTAINER = styled.div`
  ${tw`mt-[1%]`}
`

const LINE = styled.div`
  ${tw`w-full h-[2px] mt-4 rotate-0`}
  background-color: ${({ theme }) => theme.text1};
`

const REWARD_ICON = styled.img`
  ${tw`h-[38px] w-[38px] ml-3`}
  filter: ${({ theme }) => theme.substractImg};
`

const FLEX_COL_CONTAINER = styled(SpaceEvenlyDiv)`
  ${tw`flex-col h-3/4`}
`

const STAKE_BTN = styled.button`
  ${tw`block w-[263px] h-[60px] rounded-[45px] bg-white border-none 
  border-0 text-regular font-bold cursor-pointer text-[#7d289d]`}
`

const BUY_GOFX = styled.button`
  ${tw`block w-[263px] h-[60px] rounded-[45px] text-center border-none 
  border-0 text-[17px] font-bold cursor-pointer bg-transparent`}
`

const STAKE_TEXT = styled.div`
  ${tw`text-[28px] font-semibold text-center xl:text-[22px]`}
`
const APR_TEXT = styled.div`
  ${tw`text-[58px] text-center font-bold xl:text-[50px]`}
`

const CLOSE_ICON = styled.button`
  ${tw`absolute top-8 right-8 w-[25px] h-[25px] bg-transparent border-0 border-none cursor-pointer`}
`

const BOLD_TEXT = styled.span`
  ${tw`font-extrabold`}
`

export const RewardInfoComponent: FC = () => {
  const { publicKey } = useWallet()
  const [rewardsPerAddress, setrewardsPerAddress] = useState<number>()

  useEffect(() => {
    if (publicKey) {
      fetchRewards(publicKey.toBase58())
    }
  }, [publicKey])

  const fetchRewards = async (address: string): Promise<void> => {
    try {
      const res = await fetchRewardsByAddress(address)
      setrewardsPerAddress(res.data === 0 ? 0.0 : res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <REWARD_INFO_TEXT>
      <div>
        <TEXT_25>
          Rewards <REWARD_ICON src={'/img/assets/rewards.svg'} alt="rewards" />
        </TEXT_25>
      </div>
      <Row justify="space-between" align="middle" style={{ margin: '3vh 0 6vh' }}>
        <Col span="">
          <PURPLE60>
            42.69 M <TEXT_50> $GOFX</TEXT_50>
          </PURPLE60>
          <TEXT_20> Rewards over the next 12 months</TEXT_20>
        </Col>
        <Col span="">
          <GREEN60>{rewardsPerAddress !== undefined ? rewardsPerAddress.toFixed(3) : '0.000'}</GREEN60>

          <div style={{ textAlign: 'right' }}>
            <TEXT_20>$GOFX Earned</TEXT_20>
          </div>
        </Col>
      </Row>

      <REWARD_DETAILS_CONTAINER>
        <div>
          <TEXT_25>Active Rewards</TEXT_25>
        </div>

        <LINE />

        <ul style={{ padding: '0 12px' }}>
          <li>
            <TEXT_22>
              A simple <strong>1%</strong> exchange fee
            </TEXT_22>
            <TEXT_15>1% listing fee for the first 60 days on our NFT exchange.</TEXT_15>
          </li>
          <li>
            <TEXT_22>
              For each listing you will receive <strong>25 $GOFX</strong>, up to the first <strong>100,000</strong>{' '}
              listings.
            </TEXT_22>
            <TEXT_15>Up to 100,000 lisitings (We will re-asses after reaching the target).</TEXT_15>
          </li>
          <li>
            <TEXT_22>
              For each NFT sale you will receive <strong>50%</strong> of the sale fee in <strong>$GOFX</strong>.
            </TEXT_22>
            <TEXT_15>
              If you sell an NFT for $100, we will split 1% or $1 worth of $GOFX to the buyer and seller
              respectively.
            </TEXT_15>
          </li>
        </ul>
      </REWARD_DETAILS_CONTAINER>
    </REWARD_INFO_TEXT>
  )
}

export const RewardRedirectComponent: FC = () => {
  const history = useHistory()
  const { rewardToggle } = useRewardToggle()

  const handleStakeClick = () => {
    rewardToggle(false)
    history.push('/farm')
  }

  const handleBuyGOFXClick = () => {
    rewardToggle(false)
    history.push('/swap')
  }

  const closeRewardModal = () => {
    rewardToggle(false)
  }

  return (
    <FLEX_COL_CONTAINER>
      <CLOSE_ICON onClick={closeRewardModal}>
        <img src={`${window.origin}/img/assets/close-white-icon.svg`} alt="copy_address" />
      </CLOSE_ICON>
      <STAKE_TEXT>
        Stake your <BOLD_TEXT>$GOFX</BOLD_TEXT>
        <br /> and earn up to
        <APR_TEXT>200% APR</APR_TEXT>
      </STAKE_TEXT>
      <div style={{ textAlign: 'center' }}>
        <STAKE_BTN onClick={handleStakeClick}>Stake</STAKE_BTN>
        <br />
        <BUY_GOFX onClick={handleBuyGOFXClick}>Buy $GOFX</BUY_GOFX>
      </div>
    </FLEX_COL_CONTAINER>
  )
}
