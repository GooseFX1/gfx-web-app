import { FC, useState } from 'react'
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
    left: ${({ $index }) => (checkMobile() ? $index * 90 + 'px' : $index * 80 + 'px')};
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

const CARD = styled.div`
  ${tw`h-[90px] w-[32%] dark:bg-black-1 bg-white border border-solid dark:border-grey-2 border-grey-1
      rounded-small flex flex-row items-center px-3.75 sm:mb-[15px] sm:w-full`}
`

const LeaderBoard: FC = () => {
  const [screenType] = useState<number>(0)
  const [howToEarn, setHowToEarn] = useState<boolean>(false)
  const { users } = useStats()

  const { mode } = useDarkMode()
  const { wallet } = useWallet()

  return (
    <WRAPPER $isCollapsed={true} $index={screenType}>
      {howToEarn && <HowToEarn howToEarn={howToEarn} setHowToEarn={setHowToEarn} screenType={screenType} />}
      <HEADER $mode={mode} $isMobile={checkMobile()}>
        {checkMobile() && (
          <div tw="text-grey-5 font-semibold text-tiny text-center mb-3.75">Updates At 12am UTC</div>
        )}
        <div tw="relative sm:justify-start relative z-0">
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
          <div tw="text-grey-5 font-semibold text-lg text-center mt-3 mb-3.75">Season 1</div>
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

      <div tw="flex flex-row justify-between relative px-5 sm:block sm:px-[15px] sm:mb-0">
        {users?.slice(0, 3).map((user: User, index: number) => (
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
                {user?.domainName ? getFormattedDomainName(user.domainName) : truncateAddress(user?.address)}
              </div>
              <div tw="dark:text-grey-5 text-black-4 font-semibold text-lg">{user.weeklyPoints}</div>
            </div>
            <div tw="font-semibold text-regular" className={getClassNameForBoost(user?.boost)}>
              {user?.boost}x Boost
            </div>
          </CARD>
        ))}
      </div>
      <table>
        <thead className="tableHeader">
          <tr>{checkMobile() ? <ColumnHeadersMobile /> : <ColumnHeadersWeb screenType={screenType} />}</tr>
        </thead>
        <tbody>
          {users
            .filter((user: User) => user.address === wallet?.adapter?.publicKey?.toString())
            .map((user: User, index: number) => (
              <TABLE_ROW key={index}>
                {checkMobile() ? (
                  <ColumnMobile user={user} />
                ) : (
                  <ColumnWeb user={user} screenType={screenType} connectedUser={true} />
                )}
              </TABLE_ROW>
            ))}
          {screenType !== 2
            ? users
                .filter((user: User) => user.address !== wallet?.adapter?.publicKey?.toString())
                .map((user: User, index: number) =>
                  user?.weeklyPoints ? (
                    <TABLE_ROW key={index}>
                      {checkMobile() ? (
                        <ColumnMobile user={user} />
                      ) : (
                        <ColumnWeb user={user} screenType={screenType} />
                      )}
                    </TABLE_ROW>
                  ) : (
                    <></>
                  )
                )
            : users
                .filter((user: User) => user.address !== wallet?.adapter?.publicKey?.toString())
                .map((user, index: number) =>
                  user?.totalPoints ? (
                    <TABLE_ROW key={index}>
                      {checkMobile() ? (
                        <ColumnMobile user={user} />
                      ) : (
                        <ColumnWeb user={user} screenType={screenType} />
                      )}
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
