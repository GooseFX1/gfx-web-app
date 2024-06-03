import { FC, useCallback, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { truncateAddress } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  ColumnHeadersMobile,
  ColumnHeadersWeb,
  ColumnMobile,
  ColumnWeb,
  formatNumberToHumanReadable,
  getClassNameForBoost,
  getFormattedDomainName,
  HowToEarn
} from './Columns'
import { User, useStats } from '../../context/stats'
import { useDarkMode } from '../../context'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useHistory } from 'react-router-dom'
import { GradientText } from '../../components'
import useBreakPoint from '../../hooks/useBreakPoint'

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
    ${tw`w-full max-w-[1440px] mx-auto dark:bg-black-1 px-5 bg-grey-5 border-separate max-sm:px-[15px]`}
    border-spacing: 0 15px;
  }
  .tableHeader {
    th {
      ${tw`font-semibold text-regular text-black-4 dark:text-grey-5`}
    }
  }
  .slider {
    ${tw`w-20 h-10 rounded-[36px] absolute z-[-1] max-sm:rounded-[30px] max-sm:w-[90px]`}
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
    ${tw`absolute bottom-0 `}
  }
`

const HEADER = styled.div<{ $mode: string; $isMobile: boolean }>`
  ${tw`h-56 w-full pt-[15px] max-sm:h-auto max-sm:p-[15px]`}
  background: ${({ $mode }) => `
    url('/img/assets/Leaderboard/purple_bg_${$mode}.svg')
  `};

  background-repeat: no-repeat;
  mask-image: ${({ $isMobile }) => ($isMobile ? '' : 'linear-gradient(to bottom, black, transparent)')};
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
      rounded-small flex flex-row items-center px-3.75 max-sm:mb-[15px] max-sm:w-full`}
`

const LeaderBoard: FC = () => {
  const [screenType] = useState<number>(0)
  const [howToEarn, setHowToEarn] = useState<boolean>(false)
  const { users } = useStats()
  const displayUsers = useMemo(() => users, [users, screenType])
  // const leaderboardScreens = ['Perps']
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const history = useHistory()

  const redirectToTrade = useCallback(() => {
    history.push('/trade')
  }, [])

  return (
    <WRAPPER $isCollapsed={true} $index={screenType}>
      {howToEarn && <HowToEarn howToEarn={howToEarn} setHowToEarn={setHowToEarn} screenType={screenType} />}
      <HEADER $mode={mode} $isMobile={breakpoint.isMobile}>
        {breakpoint.isMobile && (
          <div tw="text-grey-5 font-semibold text-tiny text-center mb-3.75">Updates At 12am UTC</div>
        )}
        {/* <div tw="relative sm:justify-start relative z-0">
          <div tw="w-[240px] mx-auto flex flex-row justify-center relative sm:w-[270px]">
            <div className="slider"></div>
            {leaderboardScreens.map((pool, index) => (
              <div
                tw="w-[90px] h-10 flex justify-center items-center cursor-pointer font-bold
                text-regular text-grey-2"
                key={index}
                className={'active'}
              >
                {pool}
              </div>
            ))}
          </div>
        </div> */}

        <div tw="max-sm:flex max-sm:flex-row max-sm:justify-between max-sm:items-center relative">
          <div tw="text-grey-5 font-semibold text-lg text-center mt-3 mb-3.75">Season 1</div>
          <a
            href="https://docs.goosefx.io/earn/perps-leaderboard?utm_source=perps_leaderboard"
            target="_blank"
            rel="noreferrer noopener"
            css={[
              !breakpoint.isMobile && tw`absolute right-5 top-0`,
              tw`border border-solid border-grey-1 w-[149px] h-10 rounded-[100px] 
                cursor-pointer py-0.5 pl-5 pr-1 flex flex-row items-center justify-between bg-white dark:bg-black-1 
                max-sm:right-0`
            ]}
          >
            <span tw="mr-[5px] font-bold text-regular dark:text-grey-5 text-black-4 max-sm:text-tiny">
              How to earn
            </span>
            <img src="/img/assets/Leaderboard/questionMark.svg" alt="question-icon" />
          </a>
        </div>
        <div tw="relative">
          <div tw="text-grey-5 font-medium text-regular text-center max-sm:text-tiny max-sm:mb-0">
            Trade smart, climb the leaderboard, and be among {!breakpoint.isMobile && <br />}
            the top to win exciting rewards!{' '}
          </div>
          {!breakpoint.isMobile && (
            <div tw="absolute right-5 top-5 text-grey-5 font-semibold text-regular">Updates At 12am UTC</div>
          )}
        </div>
      </HEADER>
      {breakpoint.isMobile ? (
        <div
          onClick={redirectToTrade}
          tw="relative h-[213px] w-11/12 border border-solid dark:border-grey-2 border-grey-1 
            mx-auto my-3.75 rounded-tiny pt-3 flex items-center flex-col px-10 gap-2"
        >
          <div>
            <GradientText text={'SOL-PERP'} fontSize={33} fontWeight={600} />
          </div>
          <div tw="flex items-center">
            <img src={`/img/crypto/BONK.svg`} alt="nft-banner" height="77px" width="77px" />
            <div tw="text-[25px] font-semibold dark:text-white text-black-4 ml-4 text-left">
              +1.5x <br />
              Boost
            </div>
          </div>
          <div tw="text-[25px] font-semibold dark:text-white text-black-4 ml-4 mt-4">Hold 1M+ BONK</div>
        </div>
      ) : (
        <div
          tw="relative h-[134px] w-full max-w-[1440px] 
              mx-auto my-3.75 px-5"
          onClick={redirectToTrade}
        >
          <div
            tw="flex flex-row items-center h-full cursor-pointer border border-solid 
                  dark:border-grey-2 border-grey-1 rounded-tiny px-5"
          >
            <img src={`img/crypto/BONK.svg`} alt="nft-banner" tw="mr-4" width={74} height={74} />
            <GradientText text={'SOL-PERP'} fontSize={55} fontWeight={600} />
            <div tw="text-[30px] ml-auto dark:text-white text-black-4">Get +1.5x Boost by holding 1M+ BONK</div>
          </div>
        </div>
      )}

      <div tw="flex flex-row justify-between relative px-5 max-w-[1440px] mx-auto max-sm:block max-sm:px-[15px]
      max-sm:mb-0">
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
                {user?.domainName
                  ? getFormattedDomainName(user.domainName)
                  : user?.address && truncateAddress(user?.address)}
              </div>
              <div tw="dark:text-grey-5 text-black-4 font-semibold text-lg">
                {formatNumberToHumanReadable(user?.totalPoints)}
              </div>
            </div>
            <div tw="font-semibold text-regular" className={getClassNameForBoost(user?.boost)}>
              {user?.boost}x Boost
            </div>
          </CARD>
        ))}
      </div>
      <table>
        <thead className="tableHeader">
          <tr>{breakpoint.isMobile ? <ColumnHeadersMobile /> : <ColumnHeadersWeb />}</tr>
        </thead>
        <tbody>
          {displayUsers?.length &&
            displayUsers
              .filter((user: User) => user.address === wallet?.adapter?.publicKey?.toString())
              .map((user: User, index: number) => (
                <TABLE_ROW key={index}>
                  {breakpoint.isMobile ? (
                    <ColumnMobile user={user} />
                  ) : (
                    <ColumnWeb user={user} connectedUser={true} />
                  )}
                </TABLE_ROW>
              ))}
          {displayUsers &&
            displayUsers
              .filter((user: User) => user.address !== wallet?.adapter?.publicKey?.toString())
              .map((user: User, index: number) =>
                user?.totalPoints && index < 100 ? (
                  <TABLE_ROW key={index + 10}>
                    {breakpoint.isMobile ? <ColumnMobile user={user} /> : <ColumnWeb user={user} />}
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
