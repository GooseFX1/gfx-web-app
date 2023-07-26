import { FC, useState, Dispatch, SetStateAction } from 'react'
import Slider from 'react-slick'
import { useDarkMode } from '../../context'
import { checkMobile, truncateAddressForSixChar } from '../../utils'
import tw, { styled } from 'twin.macro'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import 'styled-components/macro'
import { Link } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { Tooltip } from 'antd'
import { User } from '../../context/stats'

const STYLED_POPUP = styled(PopupCustom)`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-grey-5 rounded-bigger`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`sm:p-[15px]`}
  }
  .slick-prev {
    ${tw`w-auto top-[475px] text-regular mr-1.5 font-semibold cursor-pointer z-10
      sm:top-[470px] sm:left-0 dark:text-white text-black-4`}
    &:before {
      display: none;
    }
  }
  .slick-next {
    ${tw`w-auto top-[475px] text-regular mr-1.5 font-semibold cursor-pointer z-10
      sm:top-[470px] sm:right-[-10px] dark:text-white text-black-4`}
    &:before {
      display: none;
    }
  }
  .bannerContainer {
    ${tw`rounded-bigger flex items-center justify-center sm:w-full sm:p-2.5`}
  }
  .sliderContainer {
    ${tw`h-5/6 w-11/12 sm:w-full sm:h-[90%]`}
    img {
      ${tw`m-auto`}
    }
  }
  .slide {
    * {
      ${tw`font-semibold text-center`}
    }
    h2 {
      ${tw`mt-6 text-lg font-semibold dark:text-grey-5 text-black-4 sm:mt-10`}
    }
    .subText {
      ${tw`font-medium text-regular dark:text-grey-2 mb-6 text-grey-1 sm:w-[292px] sm:text-[13px]`}
    }
    .space {
      ${tw`mt-10`}
    }
    .learn-more {
      ${tw`dark:text-grey-5 text-blue-1 font-semibold text-regular cursor-pointer block`}
      text-decoration: underline;
    }
    .listNow {
      ${tw`text-grey-5 text-regular font-semibold cursor-pointer w-[200px] h-[45px] rounded-half mt-10 
        mx-auto flex flex-row justify-center items-center sm:mt-[30px]`}
      background: linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%);
    }
    .explore {
      ${tw`text-grey-5 text-regular font-semibold cursor-pointer w-[200px] h-[45px] rounded-half mt-10 
      mx-auto flex flex-row justify-center items-center bg-blue-1 sm:mt-[30px]`}
    }
  }
`

export const ColumnWeb: FC<{ user: User }> = ({ user }) => {
  const getClassNameForLoyalty = (loyalty: number): string => {
    if (loyalty <= 50) return 'red'
    else if (loyalty > 50 && loyalty <= 85) return 'yellow'
    else return 'gradient-3'
  }

  const getClassNameForPnl = (pnl: number): string => {
    if (pnl < 0) return 'red'
    else return 'green'
  }

  return (
    <>
      <td>
        <div tw="text-left pl-2.5"># {user?.id}</div>
      </td>
      <td>
        <div>
          {user?.domainName ? getFormattedDomainName(user.domainName) : truncateAddressForSixChar(user?.address)}
        </div>
      </td>
      <td>
        <div className={getClassNameForPnl(user?.pnl)}>{user?.pnl && user?.pnl.toFixed(2)}%</div>
      </td>
      <td>
        <div className={getClassNameForBoost(user?.boost)}>{user?.boost}x</div>
      </td>
      <td>
        <div className={getClassNameForLoyalty(user?.loyalty)}>{user?.loyalty && user?.loyalty.toFixed(1)}%</div>
      </td>
      <td>
        <div>{user?.dailyPoints}</div>
      </td>
      <td>
        <div>{user?.weeklyPoints && '0'}</div>
      </td>
      <td>
        <div tw="text-right pr-2.5">{user?.weeklyPoints && '0'}</div>
      </td>
    </>
  )
}

export const ColumnHeadersWeb: FC = () => {
  const { mode } = useDarkMode()

  return (
    <>
      <th tw="text-left">Rank</th>
      <th tw="w-1/5">Wallet</th>
      <th tw="w-[10%]">
        <Tooltip
          color={mode === 'dark' ? '#EEEEEE' : '#3C3C3C'}
          title={
            <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
              Your PnL% reflects your return on investment, calculated using the current market price of your
              assets and your net deposits.
            </span>
          }
          overlayClassName={mode === 'dark' ? 'dark' : ''}
          placement="topLeft"
          overlayInnerStyle={{ borderRadius: '8px' }}
        >
          <span tw="font-semibold text-regular text-black-4 dark:text-grey-5">PnL</span>
        </Tooltip>
      </th>
      <th tw="w-[10%]">
        <Tooltip
          color={mode === 'dark' ? '#EEEEEE' : '#3C3C3C'}
          title={
            <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
              Your return on investment, calculated as Total Profit and Loss divided by Net Deposits.
            </span>
          }
          overlayClassName={mode === 'dark' ? 'dark' : ''}
          overlayInnerStyle={{ borderRadius: '8px' }}
          placement="topLeft"
        >
          <span tw="font-semibold text-regular text-black-4 dark:text-grey-5">Boost</span>
        </Tooltip>
      </th>
      <th tw="w-1/6">
        <Tooltip
          color={mode === 'dark' ? '#EEEEEE' : '#3C3C3C'}
          title={
            <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
              Higher volume and trading frequency boosts loyalty, enhancing your rewards and leaderboard position.
            </span>
          }
          overlayClassName={mode === 'dark' ? 'dark' : ''}
          overlayInnerStyle={{ borderRadius: '8px' }}
          placement="topLeft"
        >
          <span tw="font-semibold text-regular text-black-4 dark:text-grey-5">Loyalty</span>
        </Tooltip>
      </th>
      <th tw="w-1/6">24H points</th>
      <th>14D points</th>
      <th tw="text-right">Total</th>
    </>
  )
}

export const ColumnMobile: FC<{ user: User }> = ({ user }) => (
  <>
    <td>
      <div># {user?.id}</div>
    </td>
    <td>{<div>{truncateAddressForSixChar(user?.address)}</div>}</td>
    <td>
      <div>{user?.weeklyPoints}</div>
    </td>
  </>
)

export const ColumnHeadersMobile: FC = () => (
  <>
    <th>Rank</th>
    <th>Wallet</th>
    <th>Total points</th>
  </>
)

const LearnMore: FC = (): JSX.Element => (
  <a href="https://docs.goosefx.io/" className="learn-more" target="_blank" rel="noreferrer">
    Learn More
  </a>
)

export const HowToEarn: FC<{
  howToEarn: boolean
  setHowToEarn: Dispatch<SetStateAction<boolean>>
  screenType: number
}> = ({ howToEarn, setHowToEarn, screenType }): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const { wallet } = useWallet()
  const { mode } = useDarkMode()

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <div> {currentSlide !== 3 && `Next`}</div>,
    prevArrow: <div> {currentSlide !== 0 && `Previous`}</div>,
    beforeChange: (current, next) => {
      setCurrentSlide(next)
    }
  }
  return (
    <STYLED_POPUP
      height={checkMobile() ? '520px' : '530px'}
      width={checkMobile() ? '355px' : '500px'}
      title={null}
      centered={true}
      visible={howToEarn ? true : false}
      onCancel={() => setHowToEarn(false)}
      footer={null}
    >
      <div className="bannerContainer">
        <div className="sliderContainer">
          <Slider {...settings}>
            <div className="slide">
              <div tw="absolute top-[-5px] !text-grey-1 text-regular">
                <span tw="dark:text-grey-5 text-black-4">Step 1</span> of 4
              </div>
              <h2>{screenType === 0 ? 'Profit and Loss Calculation' : 'List NFTs'} </h2>
              <img
                src={`/img/assets/Leaderboard/step1_${screenType === 0 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-1-icon"
                height={checkMobile() ? '150px' : '218px'}
                width={checkMobile() ? '205px' : '250px'}
                tw="mb-4"
              />
              <div className="subText">
                {screenType === 1
                  ? 'List your NFT’s exclusively on GooseFX, the more you list the more points you will earn.'
                  : 'Your PnL% reflects your return on investment, calculated using the current market' +
                    'price of your assets and your net deposits.'}
              </div>
              <LearnMore />
              {screenType === 1 && (
                <Link
                  to={`/NFTs/profile/${wallet?.adapter?.publicKey.toBase58()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="listNow">List now</div>
                </Link>
              )}
            </div>
            <div className="slide">
              <div tw="absolute top-[-5px] !text-grey-1 text-regular">
                <span tw="dark:text-grey-5 text-black-4">Step 2</span> of 4
              </div>
              <h2>{screenType === 0 ? 'Loyalty System' : 'Bid and Accept Bids'} </h2>
              <img
                src={`/img/assets/Leaderboard/step2_${screenType === 0 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-2-icon"
                height={checkMobile() && '150px'}
                width={checkMobile() && '205px'}
              />
              <div className="subText">
                {screenType === 1
                  ? 'Bid for NFT’s exclusively on GooseFX, the more you bid or accept bids the more points you earn.'
                  : 'Earn loyalty points based on your trading volume and frequency.' +
                    'If you dont make at least 2 trades within a week, your loyalty score will decay by 10%'}
              </div>
              <LearnMore />
              {screenType === 1 && (
                <Link to="/nfts/" target="_blank" rel="noreferrer">
                  <div className="explore">Explore</div>
                </Link>
              )}
            </div>
            <div className="slide">
              <div tw="absolute top-[-5px] !text-grey-1 text-regular">
                <span tw="dark:text-grey-5 text-black-4">Step 3</span> of 4
              </div>
              <h2>{screenType === 0 ? 'Point System' : 'Buy NFT’s'} </h2>
              <img
                src={`/img/assets/Leaderboard/step3_${screenType === 0 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-3-icon"
                height={checkMobile() && '150px'}
                width={checkMobile() && '205px'}
              />
              <div className="subText">
                {screenType === 1 ? (
                  <div className={mode === 'lite' ? 'space' : ''}>
                    Purchase NFTs directly on GooseFX to earn points, more closer to the floor, more points you
                    earn.
                  </div>
                ) : (
                  'Earn points with each trade. The more loyal you are and the higher your PnL%, ' +
                  'the more points you earn.'
                )}
              </div>
              <LearnMore />
              {screenType === 1 && (
                <Link to="/nfts/" target="_blank" rel="noreferrer">
                  <div className="explore">Explore</div>
                </Link>
              )}
            </div>
            <div className="slide">
              <div tw="absolute top-[-5px] !text-grey-1 text-regular">
                <span tw="dark:text-grey-5 text-black-4">Step 4</span> of 4
              </div>
              <h2>{screenType === 0 ? 'Rewards and Eligibility' : 'Loyalty and Boost'} </h2>
              <img
                src={`/img/assets/Leaderboard/step4_${screenType === 0 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-4-icon"
                height={checkMobile() && '150px'}
                width={checkMobile() && '205px'}
              />
              {screenType === 0 && !checkMobile() && (
                <img
                  src={`/img/assets/Leaderboard/step5_${screenType === 0 ? 'perps' : 'nfts'}_${mode}.svg`}
                  alt="step-4-icon"
                  tw="!my-10"
                  height={checkMobile() && '150px'}
                  width={checkMobile() && '205px'}
                />
              )}
              <div className="subText">
                {screenType === 1
                  ? 'Maintain consistent activity on GooseFX to improve your loyalty score and stay within the top 50' +
                    'users in 24H awards a daily boost.'
                  : 'Top 20 traders are eligible to claim rewards every 14 days. Trade your' +
                    'way to the top for the main reward.'}
              </div>
              <LearnMore />
              {screenType === 0 ? (
                <Link to="/trade/" target="_blank" rel="noreferrer">
                  <div className="explore">Trade Now</div>
                </Link>
              ) : (
                <Link to="/nfts/" target="_blank" rel="noreferrer">
                  <div className="explore">Explore</div>
                </Link>
              )}
            </div>
          </Slider>
        </div>
      </div>
    </STYLED_POPUP>
  )
}

export const getClassNameForBoost = (boost: number): string => {
  if (boost < 2) return 'yellow'
  else if (boost >= 2 && boost < 3) return 'gradient-3'
  else if (boost >= 3 && boost < 5) return 'gradient-1'
  else return 'gradient-2'
}

export const getFormattedDomainName = (domainName: string): string => domainName + '.sol'
