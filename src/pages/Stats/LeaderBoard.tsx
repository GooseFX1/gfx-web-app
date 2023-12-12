import { FC, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { checkMobile, truncateAddress } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  ColumnHeadersMobile,
  ColumnHeadersWeb,
  ColumnMobile,
  ColumnWeb,
  getFormattedDomainName,
  HowToEarn
} from './Columns'
import { User, useStats } from '../../context/stats'
import { useDarkMode } from '../../context'
import { getClassNameForBoost } from './Columns'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const WRAPPER = styled.div<{ $index: number }>`
  height: calc(100vh - 56px);
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  & {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  ${tw`dark:bg-black-1 bg-grey-5`}
  table {
    ${tw`w-full dark:bg-black-1 px-5 bg-grey-5 border-separate sm:px-[15px]`}
    border-spacing: 0 15px;
  }
  .tableHeader {
    th {
      ${tw`font-semibold text-regular text-black-4 dark:text-grey-5`}
    }
  }
  .slider {
    ${tw`w-20 h-10 rounded-[36px] absolute z-[-1] sm:rounded-[30px] sm:w-[90px]`}
    left: ${({ $index }) => (checkMobile() ? $index * 90 + 'px' : $index * 80 + 35 + 'px')};
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .red {
    ${tw`text-red-2`}
  }
  .green {
    ${tw`text-green-3`}
  }
  .yellow {
    ${tw`text-[#CEB900]`}
  }
  .orange {
    ${tw`text-[#E36E1A]`}
  }
  .gradient-1 {
    background: linear-gradient(113deg, #5bffbc 0%, #18495d 132%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 0px 5px #5bffbc);
  }
  .gradient-2 {
    background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 0px 5px #dc1fff);
  }
  .gradient-3 {
    ${tw`text-green-3`}
    filter: drop-shadow(0px 0px 5px #80ce00);
  }
  .disable {
    ${tw`cursor-not-allowed`}
  }
  .right {
    ${tw`text-right pr-2.5`}
  }
  .banner-mobile {
    ${tw`absolute bottom-0`}
    left: calc(50% - 110px)
  }
`

const BANNER_TXT_MOBILE = styled.div`
  ${tw`absolute bottom-0 font-semibold text-[30px] leading-[35px]`}
  left: 50%;
  background: -webkit-linear-gradient(#e0b5ff, #9e1aff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const BANNER_WRAPPER = styled.div`
  ${tw`relative h-[134px] w-full border border-solid dark:border-grey-2 border-grey-1 
  mx-auto mb-3.75 rounded-tiny pt-5 px-10`}
  width: calc(100% - 40px);
`

const HEADER = styled.div<{ $mode: string; $isMobile: boolean }>`
  ${tw`h-56 w-full pt-[15px] sm:h-auto sm:p-[15px]`}
  background: ${({ $mode }) => `url('/img/assets/Leaderboard/purple_bg_${$mode}.svg')`};
  background-repeat: no-repeat;
  background-size: ${({ $isMobile }) => ($isMobile ? 'auto' : '100%')};

  .active {
    ${tw`rounded-[36px] cursor-pointer text-white`}
  }
`

export const TABLE_ROW = styled.tr`
  ${tw`dark:bg-black-2 bg-white h-[50px] font-medium`}
  td {
    ${tw`text-center dark:text-grey-5 text-black-4 font-semibold text-regular`}
  }
  td.loyalty {
    ${tw`text-green-1`}
  }
`

const BANNER_BTN = styled.div`
  ${tw`absolute bottom-[25px] text-lg text-grey-5 w-[200px] h-10 rounded-[36px] cursor-pointer
  text-white flex flex-row items-center justify-center sm:bottom-auto sm:mb-2.5`}
  left: calc(50% - 100px);
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  > a {
    ${tw`text-white font-semibold`}
  }
  > a:hover {
    ${tw`text-white font-semibold`}
  }
`

const BANNER_TXT_1 = styled.div`
  ${tw`text-[55px] leading-[50px] font-semibold`}
  background: -webkit-linear-gradient(#e0b5ff, #9e1aff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const BANNER_TXT_2 = styled.span`
  ${tw`absolute text-[30px] font-semibold leading-none text-black-4 dark:text-grey-5`}
  left: calc(50% - 90px);
`

const CARD = styled.div`
  ${tw`h-[90px] w-[32%] dark:bg-black-1 bg-white border border-solid dark:border-grey-2 border-grey-1
      rounded-small flex flex-row items-center px-3.75 sm:mb-[15px] sm:w-full`}
`

const LeaderBoard: FC = () => {
  const [screenType, setScreenType] = useState<number>(0)
  const [howToEarn, setHowToEarn] = useState<boolean>(false)
  const { users } = useStats()
  const displayUsers = useMemo(() => users, [users, screenType])

  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const leaderboardScreens = ['Perps', 'Devnet']

  return (
    <WRAPPER $isCollapsed={true} $index={screenType}>
      {howToEarn && <HowToEarn howToEarn={howToEarn} setHowToEarn={setHowToEarn} screenType={screenType} />}
      <HEADER $mode={mode} $isMobile={checkMobile()}>
        {checkMobile() && (
          <div tw="text-grey-5 font-semibold text-tiny text-center mb-3.75">Updates At 12am UTC</div>
        )}
        <div tw="relative sm:justify-start relative z-0">
          <div tw="w-[240px] mx-auto flex flex-row justify-center relative sm:w-[270px]">
            <div className="slider"></div>
            {leaderboardScreens.map((pool, index) => (
              <div
                tw="w-[90px] h-10 flex justify-center items-center cursor-pointer font-bold
                text-regular text-grey-2"
                key={index}
                onClick={() => {
                  index === 1 ? null : setScreenType(index)
                }}
                className={index === 1 ? 'disable' : index === screenType ? 'active' : ''}
              >
                {pool}
              </div>
            ))}
          </div>
          {!checkMobile() && (
            <div
              tw="absolute right-5 top-0 border border-solid border-grey-1 w-[149px] h-10 rounded-[100px] cursor-pointer
                py-0.5 pl-2.5 pr-0.5 flex flex-row items-center justify-center bg-white dark:bg-black-1 sm:right-0"
              onClick={() => {
                setHowToEarn(true)
              }}
            >
              <span tw="mr-[5px] font-bold text-regular dark:text-grey-5 text-black-4 sm:text-tiny">
                How to earn
              </span>
              <img src="/img/assets/Leaderboard/questionMark.svg" alt="question-icon" />
            </div>
          )}
        </div>
        <div tw="sm:flex sm:flex-row sm:justify-between sm:items-center">
          <div tw="text-grey-5 font-semibold text-lg text-center mt-3 mb-3.75">
            {screenType === 1 ? (
              <div tw="sm:text-left">Paper Trade {checkMobile() && <br />}Season 1</div>
            ) : (
              'Season 1'
            )}
          </div>
          {checkMobile() && (
            <div
              tw="border border-solid border-grey-1 w-[45%] h-10 rounded-[100px]
                py-0.5 pl-2.5 pr-0.5 flex flex-row items-center justify-around bg-white dark:bg-black-1"
            >
              <span
                tw="mr-[5px] font-semibold text-regular dark:text-grey-5 text-black-4"
                onClick={() => {
                  setHowToEarn(true)
                }}
              >
                How to earn
              </span>
              <img src="/img/assets/Leaderboard/questionMark.svg" alt="question-icon" />
            </div>
          )}
        </div>
        <div tw="relative">
          <div tw="dark:text-grey-2 text-black-4 font-medium text-regular text-center sm:text-tiny sm:mb-0">
            Trade smart, climb the leaderboard, and be among {!checkMobile() && <br />}
            the top to win exciting rewards!{' '}
          </div>
          {!checkMobile() && (
            <div tw="absolute right-5 top-5 dark:text-grey-5 font-semibold text-regular text-black-4">
              Updates At 12am UTC
            </div>
          )}
        </div>
      </HEADER>
      {checkMobile() ? (
        <div
          tw="relative h-[213px] w-11/12 border border-solid dark:border-grey-2 border-grey-1 
            mx-auto my-3.75 rounded-tiny pt-5 px-10"
        >
          <div tw="text-center text-lg font-semibold mb-3 dark:text-grey-5 text-black-4">MonkeDAO</div>
          <BANNER_BTN>
            <a href="https://app.goosefx.io/trade/n3Lx4oVjUN1XAD6GMB9PLLhX9W7TPakdzW461mhF95u/">Trade Now</a>
          </BANNER_BTN>
          <img
            src="/img/assets/Leaderboard/mobile_banner.png"
            alt="nft-banner"
            height="98px"
            width="120px"
            className="banner-mobile"
          />
          <BANNER_TXT_MOBILE>
            1.5x <br /> Boost
          </BANNER_TXT_MOBILE>
        </div>
      ) : (
        <BANNER_WRAPPER>
          <div tw="flex flex-row">
            <img src="/img/assets/Leaderboard/Banner.png" alt="nft-banner" width={134} height={110} />
            <BANNER_TXT_1>
              1.5x <br /> Boost
            </BANNER_TXT_1>
            <BANNER_BTN>
              <a href="https://app.goosefx.io/trade/n3Lx4oVjUN1XAD6GMB9PLLhX9W7TPakdzW461mhF95u/">Trade Now</a>
            </BANNER_BTN>
            <BANNER_TXT_2>MonkeDAO</BANNER_TXT_2>
          </div>
        </BANNER_WRAPPER>
      )}
      <div tw="flex flex-row justify-between relative px-5 sm:block sm:px-[15px] sm:mb-0">
        {displayUsers?.slice(0, 3).map((user: User, index: number) => (
          <CARD key={index}>
            <div tw="text-lg font-semibold mr-3.75 text-black-4 dark:text-grey-5">#{user?.id}</div>
            <img
              src={`/img/assets/Leaderboard/${user?.id}User_${mode}.svg`}
              alt="badge"
              height="56"
              width="50"
              tw="mr-[4%]"
            />
            <div tw="flex flex-col mr-auto">
              <div tw="dark:text-grey-2 text-grey-1 font-semibold text-regular">
                {user?.domainName
                  ? getFormattedDomainName(user.domainName)
                  : user?.address && truncateAddress(user?.address)}
              </div>
              <div tw="dark:text-grey-5 text-black-4 font-semibold text-lg">{user.contestPoints}</div>
            </div>
            <div tw="font-semibold text-regular" className={getClassNameForBoost(user?.boost)}>
              {user?.boost}x Boost
            </div>
          </CARD>
        ))}
      </div>
      <table>
        <thead className="tableHeader">
          <tr>{checkMobile() ? <ColumnHeadersMobile /> : <ColumnHeadersWeb />}</tr>
        </thead>
        <tbody>
          {displayUsers?.length &&
            displayUsers
              .filter((user: User) => user.address === wallet?.adapter?.publicKey?.toString())
              .map((user: User, index: number) => (
                <TABLE_ROW key={index}>
                  {checkMobile() ? <ColumnMobile user={user} /> : <ColumnWeb user={user} connectedUser={true} />}
                </TABLE_ROW>
              ))}
          {displayUsers &&
            displayUsers
              .filter((user: User) => user.address !== wallet?.adapter?.publicKey?.toString())
              .map((user: User, index: number) =>
                user?.totalPoints ? (
                  <TABLE_ROW key={index}>
                    {checkMobile() ? <ColumnMobile user={user} /> : <ColumnWeb user={user} />}
                  </TABLE_ROW>
                ) : (
                  <></>
                )
              )}
        </tbody>
      </table>
    </WRAPPER>
  )
}
export default LeaderBoard
