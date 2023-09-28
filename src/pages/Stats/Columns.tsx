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

export const ColumnWeb: FC<{ user: User; screenType: number; connectedUser?: boolean }> = ({
  user,
  screenType,
  connectedUser
}) => {
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
          {connectedUser ? (
            <span className="gradient-3">You</span>
          ) : user?.domainName ? (
            getFormattedDomainName(user.domainName)
          ) : (
            truncateAddressForSixChar(user?.address)
          )}
        </div>
      </td>
      {screenType !== 2 && (
        <td>
          <div className={getClassNameForPnl(user?.pnl)}>{user?.pnl && user?.pnl}%</div>
        </td>
      )}
      <td>
        <div className={getClassNameForBoost(user?.boost)}>{user?.boost}x</div>
      </td>
      <td>
        <div className={getClassNameForLoyalty(user?.loyalty)}>{user?.loyalty && user?.loyalty.toFixed(1)}%</div>
      </td>
      {screenType !== 2 && (
        <td>
          <div>{user?.dailyPoints ?? '0'}</div>
        </td>
      )}
      <td>
        <div className={screenType !== 2 ? 'right' : ''}>{user?.weeklyPoints ?? '0'}</div>
      </td>
      {screenType === 2 && (
        <td>
          <div tw="text-right pr-2.5">{user?.totalPoints ?? '0'}</div>
        </td>
      )}
    </>
  )
}

export const ColumnHeadersWeb: FC<{ screenType: number }> = ({ screenType }) => {
  const { mode } = useDarkMode()
  return (
    <>
      <th tw="text-left">Rank</th>
      <th tw="w-1/5">Wallet</th>
      {screenType !== 2 && (
        <th tw="w-[10%]">
          <Tooltip
            color={mode === 'dark' ? '#EEEEEE' : '#3C3C3C'}
            title={
              <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                Your PnL% reflects your return on investment, calculated using the current market price of your
                assets and your net deposits.
              </span>
            }
            overlayClassName={mode === 'dark' ? 'dark leaderboard-tooltip' : 'leaderboard-tooltip'}
            placement="topLeft"
            overlayInnerStyle={{ borderRadius: '8px' }}
          >
            <span tw="font-semibold text-regular text-black-4 dark:text-grey-5 underline">PnL</span>
          </Tooltip>
        </th>
      )}
      <th tw="w-[10%]">
        <Tooltip
          color={mode === 'dark' ? '#EEEEEE' : '#3C3C3C'}
          title={
            <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
              Hold an SMB NFT and earn loyalty for more points.
            </span>
          }
          overlayClassName={mode === 'dark' ? 'dark leaderboard-tooltip' : 'leaderboard-tooltip'}
          overlayInnerStyle={{ borderRadius: '8px' }}
          placement="topLeft"
        >
          <span tw="font-semibold text-regular text-black-4 dark:text-grey-5 underline">Boost</span>
        </Tooltip>
      </th>
      <th tw="w-1/6">
        <Tooltip
          color={mode === 'dark' ? '#EEEEEE' : '#3C3C3C'}
          title={
            <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
              Trade often; higher loyalty equals more points.
            </span>
          }
          overlayClassName={mode === 'dark' ? 'dark leaderboard-tooltip' : 'leaderboard-tooltip'}
          overlayInnerStyle={{ borderRadius: '8px' }}
          placement="topLeft"
        >
          <span tw="font-semibold text-regular text-black-4 dark:text-grey-5 underline">Loyalty</span>
        </Tooltip>
      </th>
      {screenType !== 2 && <th tw="w-1/6">24H points</th>}
      <th className={screenType !== 2 ? 'right' : ''}>14D points</th>
      {screenType === 2 && <th tw="text-right">Total</th>}
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
    <th>14D points</th>
  </>
)

const LearnMore: FC<{ screenType: number }> = ({ screenType }): JSX.Element => (
  <a
    href={
      screenType === 1
        ? 'https://docs.goosefx.io/features/earn-with-goosefx/leaderboard-rewards/perpetuals-leaderboard-devnet'
        : 'https://docs.goosefx.io/features/earn-with-goosefx/leaderboard-rewards/nft-leaderboard'
    }
    className="learn-more"
    target="_blank"
    rel="noreferrer"
    tw="block my-0 mx-auto w-1/2"
  >
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
              <h2>{screenType !== 2 ? 'Profit and Loss Calculation' : 'List NFTs'} </h2>
              <img
                src={`/img/assets/Leaderboard/step1_${screenType !== 2 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-1-icon"
                height={checkMobile() ? '150px' : '218px'}
                width={checkMobile() ? '205px' : '250px'}
                tw="mb-4"
              />
              <div className="subText">
                {screenType === 2
                  ? 'List your NFT’s exclusively on GooseFX, the more you list the more points you will earn.'
                  : 'Your PnL% reflects your return on investment, calculated using the current market' +
                    'price of your assets and your net deposits.'}
              </div>
              <LearnMore screenType={screenType} />
              {screenType === 2 && (
                <Link
                  to={`/NFTs/profile/${wallet?.adapter?.publicKey.toBase58()}`}
                  target="_blank"
                  rel="noreferrer"
                  tw="block w-1/2 mx-auto my-0 sm:w-full"
                >
                  <div className="listNow">List now</div>
                </Link>
              )}
            </div>
            <div className="slide">
              <div tw="absolute top-[-5px] !text-grey-1 text-regular">
                <span tw="dark:text-grey-5 text-black-4">Step 2</span> of 4
              </div>
              <h2>{screenType !== 2 ? 'Loyalty System' : 'Bid and Accept Bids'} </h2>
              <img
                src={`/img/assets/Leaderboard/step2_${screenType !== 2 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-2-icon"
                height={checkMobile() && '150px'}
                width={checkMobile() && '205px'}
              />
              <div className="subText">
                {screenType === 2
                  ? 'Bid for NFT’s exclusively on GooseFX, the more you bid or accept bids the more points you earn.'
                  : 'Earn loyalty points based on your trading volume and frequency.' +
                    "If you don't make at least 2 trades within a week, your loyalty score will decay by 10%"}
              </div>
              <LearnMore screenType={screenType} />
              {screenType === 2 && (
                <Link to="/nfts/" target="_blank" rel="noreferrer" tw="block w-1/2 mx-auto my-0 sm:w-full">
                  <div className="explore">Explore</div>
                </Link>
              )}
            </div>
            <div className="slide">
              <div tw="absolute top-[-5px] !text-grey-1 text-regular">
                <span tw="dark:text-grey-5 text-black-4">Step 3</span> of 4
              </div>
              <h2>{screenType !== 2 ? 'Point System' : 'Buy NFT’s'} </h2>
              <img
                src={`/img/assets/Leaderboard/step3_${screenType !== 2 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-3-icon"
                height={checkMobile() && '150px'}
                width={checkMobile() && '205px'}
              />
              <div className="subText">
                {screenType === 2 ? (
                  <div className={mode === 'lite' ? 'space' : ''}>
                    Purchase NFTs directly on GooseFX to earn points, more closer to the floor, more points you
                    earn.
                  </div>
                ) : (
                  'Earn points with each trade. The more loyal you are and the higher your PnL%, ' +
                  'the more points you earn.'
                )}
              </div>
              <LearnMore screenType={screenType} />
              {screenType === 2 && (
                <Link to="/nfts/" target="_blank" rel="noreferrer" tw="block w-1/2 mx-auto my-0 sm:w-full">
                  <div className="explore">Explore</div>
                </Link>
              )}
            </div>
            <div className="slide">
              <div tw="absolute top-[-5px] !text-grey-1 text-regular">
                <span tw="dark:text-grey-5 text-black-4">Step 4</span> of 4
              </div>
              <h2>{screenType !== 2 ? 'Rewards and Eligibility' : 'Loyalty and Boost'} </h2>
              <img
                src={`/img/assets/Leaderboard/step4_${screenType !== 2 ? 'perps' : 'nfts'}_${mode}.svg`}
                alt="step-4-icon"
                height={checkMobile() && '150px'}
                width={checkMobile() && '205px'}
              />
              {screenType !== 2 && !checkMobile() && (
                <img
                  src={`/img/assets/Leaderboard/step5_${screenType !== 2 ? 'perps' : 'nfts'}_${mode}.svg`}
                  alt="step-4-icon"
                  tw="!my-10"
                  height={checkMobile() && '150px'}
                  width={checkMobile() && '205px'}
                />
              )}
              <div className="subText">
                {screenType === 2
                  ? 'Maintain consistent activity on GooseFX to improve your loyalty score and stay within the top 50' +
                    'users in 24H awards a daily boost.'
                  : 'Top 20 traders are eligible to claim rewards every 14 days. Trade your' +
                    'way to the top for the main reward.'}
              </div>
              <LearnMore screenType={screenType} />
              <Link
                to={screenType !== 2 ? '/trade/n3Lx4oVjUN1XAD6GMB9PLLhX9W7TPakdzW461mhF95u/' : '/nfts'}
                target="_blank"
                rel="noreferrer"
                tw="block w-1/2 mx-auto my-0 sm:w-full"
              >
                <div className="explore">Trade Now</div>
              </Link>
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
