/* eslint-disable */
import { FC, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { checkMobile, truncateAddress } from '../../utils'
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

const TIMER = styled.div`
  ${tw`w-full flex flex-col justify-center items-center`}
  height: calc(100vh - 56px);
  width: 100%;
  background: url('/img/assets/Leaderboard/live_banner.svg');
`

const WRAPPER = styled.div<{ $index: number }>`
  ${tw`dark:bg-black-1 bg-grey-5`}
  table {
    ${tw`w-full dark:bg-black-1 px-5 bg-grey-5 border-separate sm:px-[15px]`}
    border-spacing: 0 20px;
    @media (max-width: 500px) {
      border-spacing: 0 15px;
    }
  }
  .tableHeader {
    th {
      ${tw`font-semibold text-regular text-black-4 dark:text-grey-5`}
    }
  }
  .slider {
    ${tw`w-20 h-10 rounded-[36px] absolute z-[-1] sm:rounded-[30px]`}
    left: ${({ $index }) =>
      !checkMobile() ? ($index === 0 ? '41%' : $index === 1 ? '47%' : '53%') : $index === 0 ? '0' : '90px'};
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
`
const HEADER = styled.div<{ $mode: string; $isMobile: boolean }>`
  ${tw`h-60 w-full pt-[15px] sm:h-auto sm:p-[15px]`}
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
const BANNER_TEXT = styled.div`
  ${tw`absolute top-7 font-semibold text-lg text-grey-5`}
  left: calc(50% - 159px);
`

const BANNER_BTN = styled.div`
  ${tw`absolute bottom-10 font-semibold text-lg text-grey-5 w-[200px] h-10 rounded-[36px] 
    text-white flex flex-row items-center justify-center cursor-pointer`}
  left: calc(50% - 100px);
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
`

const CARD = styled.div`
  ${tw`h-[90px] w-[370px] dark:bg-black-1 bg-white border border-solid dark:border-grey-2 border-grey-1
      rounded-small flex flex-row items-center px-3.75 sm:mb-[15px] sm:w-full`}
`

export const LeaderBoard: FC = () => {
  const [screenType, setScreenType] = useState<number>(0)
  const [howToEarn, setHowToEarn] = useState<boolean>(false)
  const [isLive, setIslive] = useState<boolean>(true)
  const { users } = useStats()
  const { mode } = useDarkMode()
  const leaderboardScreens = ['Perps', 'Devnet', 'NFTs']

  return isLive ? (
    <WRAPPER $isCollapsed={true} $index={screenType}>
      {howToEarn && <HowToEarn howToEarn={howToEarn} setHowToEarn={setHowToEarn} screenType={screenType} />}
      <HEADER $mode={mode} $isMobile={checkMobile()}>
        <div tw="flex flex-row justify-center relative sm:justify-start relative z-0">
          <div className="slider"></div>
          {leaderboardScreens.map((pool, index) => (
            <div
              tw="w-20 h-10 flex justify-center items-center cursor-pointer mr-2.5 
              font-semibold text-regular text-grey-2"
              key={index}
              onClick={() => setScreenType(index)}
              className={index === screenType ? 'active' : ''}
            >
              {pool}
            </div>
          ))}
          <div
            tw="absolute right-5 border border-solid border-grey-1 w-[149px] h-10 rounded-[100px] cursor-pointer
            py-0.5 pl-2.5 pr-0.5 flex flex-row items-center justify-center bg-white dark:bg-black-1 sm:right-0"
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
        </div>
        <div tw="text-grey-5 font-semibold text-[30px] text-center mt-3 mb-3.75 sm:text-lg">
          {screenType === 1 ? 'Paper Trade Season 1' : 'Season 1'}
        </div>
        <div tw="relative">
          <div tw="dark:text-grey-2 text-black-4 font-medium text-regular text-center mb-[30px] sm:text-tiny sm:mb-6">
            Trade smart, climb the leaderboard, and be among {!checkMobile() && <br />}
            the top 20 to win exciting rewards!{' '}
          </div>
          <div tw="absolute right-5 dark:text-grey-5 font-semibold text-regular text-black-4">
            Updates At 12am UTC
          </div>
        </div>
      </HEADER>
      <div tw="flex flex-row justify-between relative px-5 mb-[30px] sm:block sm:px-[15px] sm:mb-0">
        {users?.slice(0, 3).map((user: User, index) => (
          <CARD key={index}>
            <div tw="text-lg font-semibold mr-3.75 text-black-4 dark:text-grey-5">#{user?.id}</div>
            <img
              src={`/img/assets/Leaderboard/${user?.id}User_${mode}.svg`}
              alt="badge"
              height="56"
              width="50"
              tw="mr-3.75"
            />
            <div tw="flex flex-col mr-auto">
              <div tw="dark:text-grey-2 text-grey-1 font-semibold text-regular">
                {user?.domainName ? getFormattedDomainName(user.domainName) : truncateAddress(user?.address)}
              </div>
              <div tw="dark:text-grey-5 text-black-4 font-semibold text-lg">{user.weeklyPoints}p</div>
            </div>
            <div tw="font-semibold text-regular" className={getClassNameForBoost(user?.boost)}>
              {user?.boost}x Boost
            </div>
          </CARD>
        ))}
      </div>
      {screenType === 2 && !checkMobile() && (
        <div tw="relative">
          <img
            src="/img/assets/Leaderboard/nft_banner.svg"
            alt="nft-banner"
            width={'100%'}
            height={134}
            tw="mb-5 px-5"
          />
          <BANNER_TEXT>Solana Monkey Buisness Gen 3</BANNER_TEXT>
          <BANNER_BTN>Trade</BANNER_BTN>
        </div>
      )}
      <table>
        <thead className="tableHeader">
          <tr>{checkMobile() ? <ColumnHeadersMobile /> : <ColumnHeadersWeb screenType={screenType} />}</tr>
        </thead>
        <tbody>
          {users.map((user: User, index) => (
            <TABLE_ROW key={index}>
              {checkMobile() ? <ColumnMobile user={user} /> : <ColumnWeb user={user} screenType={screenType} />}
            </TABLE_ROW>
          ))}
        </tbody>
      </table>
    </WRAPPER>
  ) : (
    <TIMER>
      <div tw="text-lg font-semibold text-grey-5">Get Ready For Our Leaderboard!</div>
      <div tw="text-[40px] font-semibold text-grey-5">10D: 24H :32MIN</div>
    </TIMER>
  )
}
