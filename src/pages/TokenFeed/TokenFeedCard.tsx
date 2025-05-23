import React, { FC, ReactNode } from 'react'
import { Button, Icon } from 'gfx-component-lib'
import { openLinkInNewTab } from '@/web3'
import { numberFormatter } from '@/utils'
import { TokenFeedToken } from '@/pages/TokenFeed/TokenFeedContainer'
import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'

const IconWithInfo: FC<{
  data: ReactNode
  src: string
}> = ({ data, src }) => (
  <div className={`inline-flex p-1 gap-1 items-center`}>
    <Icon
      className={`rounded-full !w-[18px] !h-[18px] !max-w-[18px] !max-h-[18px] !min-w-[18px] !min-h-[18px]`}
      src={src}
    />
    <p className={`font-semibold text-b3 dark:text-text-darkmode-tertiary`}>{data}</p>
  </div>
)
const SocialIcon: FC<{
  socialLink: string
  src: string
}> = ({ src, socialLink }) => <Icon src={src} size={'sm'} onClick={() => openLinkInNewTab(socialLink)} />
const TokenFeedStats: FC<{
  marketCap: string
  volume: string
}> = ({ marketCap, volume }) => (
  <div className={`inline-flex gap-5`}>
    <p className={`font-semibold text-b2 dark:text-text-darkmode-primary`}>MC ${marketCap}</p>
    <p className={`font-semibold text-b2 dark:text-text-darkmode-primary`}>V ${volume}</p>
  </div>
)

function TokenFeedCard({ token }: { token: TokenFeedToken; key?: string }) {
  const doesTokenPoolExist = useQuery({
    queryKey: ['doesTokenExist', token.address],
    queryFn: async () => {
      // TODO: implement this
      console.log('DO THIS HERE')
      return true
    },
    enabled: !!token.address,
    staleTime: INTERVALS.SECOND * 5
  })

  const copyTokenDetails = () => console.log('todo this')

  return (
    <div className={`flex flex-col p-2 gap-2 rounded-[8px] dark:bg-background-darkmode-secondary`}>
      <div className={'inline-flex gap-2 justify-between'}>
        <h3 className={`dark:text-text-darkmode-primary`}>{token.tickerSymbol}</h3>
        <p className={`font-semibold text-b2 dark:text-text-darkmode-secondary`}>{token.name}</p>
        <Icon
          src={'/img/assets/clipboard_dark.svg'}
          className={`!w-[15px] !h-[15px] !max-w-[15px] !max-h-[15px] !min-w-[15px] !min-h-[15px]
              cursor-pointer`}
          onClick={copyTokenDetails}
        />
        <div className={'inline-flex ml-auto gap-4'}>
          <SocialIcon socialLink={'https://twitter.com/'} src={`/img/assets/twitter.svg`} />
          <SocialIcon socialLink={'https://twitter.com/'} src={`/img/assets/twitter.svg`} />
          <SocialIcon socialLink={'https://twitter.com/'} src={`/img/assets/twitter.svg`} />
        </div>
      </div>
      <div className={`inline-flex gap-4 justify-between`}>
        <Icon src={''} className={'w-[64px] h-[64px]'} />
        <div className={`flex flex-col gap-2`}>
          <TokenFeedStats marketCap={numberFormatter(2000)} volume={numberFormatter(2000)} />
          <div className={`inline-flex gap-2`}>
            <IconWithInfo src={'/img/assets/clock_dark.svg'} data={token.age} />
            <IconWithInfo src={'/img/assets/holders_dark.svg'} data={numberFormatter(token.holders)} />
            <IconWithInfo src={'/img/assets/top_holders_dark.svg'} data={token.topHolders} />
          </div>
        </div>
        <div className={`flex flex-col gap-2`}>
          <Button variant={'outline'} colorScheme={'purple'} size={'sm'} className={`px-2.5 py-[5px] w-[74px]`}>
            {doesTokenPoolExist?.data ? 'LP' : 'Create'}
          </Button>
          <Button colorScheme={'blue'} size={'sm'} className={`mt-auto px-2.5 py-[5px] w-[74px]`}>
            Swap
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TokenFeedCard
