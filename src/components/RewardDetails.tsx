import React, { FC, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
// import Close from "/img/assets/close-white-icon.svg";
import { useHistory } from 'react-router-dom'
import { Row, Col } from 'antd'
import { useRewardToggle } from '../context/reward_toggle'
import { fetchRewardsByAddress } from '../api/NFTs'
import { SpaceEvenlyDiv } from '../styles'

const REWARD_INFO_TEXT = styled.div`
  padding: ${({ theme }) => theme.margin(4)} ${({ theme }) => theme.margin(5)};
  color: ${({ theme }) => theme.text1} !important;
`

const TEXT_20 = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text1} !important;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 15px;
  `}
`
const TEXT_50 = styled.span`
  font-size: 50px;
  font-weight: bold;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 40px;
  `}
`

const TEXT_60 = styled.span`
  font-family: Montserrat;
  font-size: 60px;
  font-stretch: normal;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  letter-spacing: normal;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 40px;
  `}
`

const PURPLE60 = styled(TEXT_60)`
  background-image: linear-gradient(56deg, #716fff 20%, #e95aff 55%);
`

const TEXT_25 = styled.span`
  font-size: 25px;
  font-weight: 600;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 20px;
  `}
`

const TEXT_22 = styled.div`
  font-size: 22px;
  margin-top: 3vh;
  font-weight: 500;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 18px;
  `}
`

const TEXT_15 = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text16};
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 12px;
  `}
`

const GREEN60 = styled(TEXT_60)`
  background-image: linear-gradient(264deg, #9cc034 56%, #49821c 99%);
`

const REWARD_DETAILS_CONTAINER = styled.div`
  margin-top: 1%;
`

const LINE = styled.div`
  width: 100%;
  height: 2px;
  margin-top: ${({ theme }) => theme.margin(2)};
  transform: rotate(0deg);
  background-color: ${({ theme }) => theme.text1};
`

const REWARD_ICON = styled.img`
  height: 38px;
  width: 38px;
  margin-left: 12px;
  filter: ${({ theme }) => theme.substractImg};
`

const FLEX_COL_CONTAINER = styled(SpaceEvenlyDiv)`
  flex-direction: column;
  height: 75%;
`

const STAKE_BTN = styled.button`
  display: block;
  width: 263px;
  height: 60px;
  border-radius: 45px;
  background-color: #fff;
  border: none;
  color: #7d289d;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`

const BUY_GOFX = styled.button`
  display: block;
  height: 60px;
  width: 263px;
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  background: transparent;
  border: none;
  cursor: pointer;
`

const STAKE_TEXT = styled.div`
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 22px;
  `}
`
const APR_TEXT = styled.div`
  font-size: 58px;
  text-align: center;
  font-weight: bold;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 50px;
  `}
`

const CLOSE_ICON = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;
  width: 25px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
`

const BOLD_TEXT = styled.span`
  font-weight: 800;
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
              For each listing you will recive <strong>25 $GOFX</strong>, up to the first <strong>100,000</strong>{' '}
              listings.
            </TEXT_22>
            <TEXT_15>Up to 100,000 lisitings (We will re-asses after reaching the target).</TEXT_15>
          </li>
          <li>
            <TEXT_22>
              For each NFT sale you will receive <strong>50%</strong> of the sale fee in <strong>$GOFX</strong>.
            </TEXT_22>
            <TEXT_15>
              If you sell an NFT for $100, we will split 1% or $1 worth of $GOFX to the buyer and seller respectively.
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
