import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Button, cn, Icon, ToastTitle } from 'gfx-component-lib'
import { openLinkInNewTab } from '@/web3'
import { loadIconImage, numberFormatter } from '@/utils'
import { TokenFeedToken } from '@/pages/TokenFeed/TokenFeedContainer'
import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'
import { toast } from 'sonner'
import SuccessIcon from '@/assets/Success-icon.svg?react'
import { useDarkMode, useGamma } from '@/context'
import CircularProgress from '@/components/CircularProgress'
import { useHistory } from 'react-router-dom'

const IconWithInfo: FC<{
  data: ReactNode
  src: string
}> = ({ data, src }) => (
  <div className={`inline-flex p-1 gap-1 items-center group`}>
    <Icon
      className={`rounded-full !w-[18px] !h-[18px] !max-w-[18px] !max-h-[18px] !min-w-[18px] !min-h-[18px]
      group-hover:hue-rotate-[-45deg]`}
      src={src}
    />
    <p className={`font-semibold text-b3 text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`}>{data}</p>
  </div>
)
const SocialIcon: FC<{
  socialLink: string
  src: string,
}> = ({ src, socialLink }) => <Icon
  src={src}
  size={'sm'}
  className={`cursor-pointer hover:invert hover:hue-rotate-[553deg]`}
  onClick={() => openLinkInNewTab(socialLink)}
  />
const TokenFeedStats: FC<{
  marketCap: string
  volume: string
}> = ({ marketCap, volume }) => (
  <div className={`inline-flex gap-5`}>
    <p className={`font-semibold text-b2 text-text-lightmode-primary dark:text-text-darkmode-primary`}>
      MC ${marketCap}
    </p>
    <p className={`font-semibold text-b2 text-text-lightmode-primary dark:text-text-darkmode-primary`}>
      V ${volume}
    </p>
  </div>
)

function TokenFeedCard({ token }: { token: TokenFeedToken; key?: string }) {
  const { mode } = useDarkMode()
  const history = useHistory()
  const {setIsCreatePool} = useGamma()
  const [progressSim, setProgressSim] = useState(0)

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

  const copyTokenDetails = () => {
    navigator.clipboard.writeText(token.address)
    toast(
      <div>
        <ToastTitle
          className={'items-center'}
          iconLeft={<SuccessIcon className={'stroke-background-green h-4 w-4'} />}
        >
          <h4 className={'text-h4 text-text-green'}>Success</h4>
        </ToastTitle>
        <p className={'text-text-lightmode-secondary dark:text-text-darkmode-secondary text-b3 mt-2'}>
          Token address copied successfully!
        </p>
      </div>,
      {
        id: 'copyTokenFeedAddress'
      }
    )
  }
  useEffect(() => {
    const interval = setInterval(()=>{
      setProgressSim(prev=>{
        const newProgress = prev + 1
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    },1000)
    return ()=>clearInterval(interval)
  }, [])

  const handleLp = ()=>{
    if (doesTokenPoolExist.isSuccess) {
      if (doesTokenPoolExist.data) {
        setIsCreatePool(true)
      } else {
        // TODO: how are we handling this
      }
    }
    history.replace({
      pathname: '/gamma'
    })
  }
  const img = loadIconImage(token.src, mode)

  return (
    <div
      className={`flex flex-col p-2 gap-2 rounded-[8px] bg-background-lightmode-secondary
     dark:bg-background-darkmode-secondary min-w-[280px] max-w-[417px]`}
    >
      <div className={'inline-flex gap-2 justify-between'}>
        <h3 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>{token.tickerSymbol}</h3>
        <p className={`font-semibold text-b2 text-text-lightmode-secondary dark:text-text-darkmode-secondary`}>
          {token.name}
        </p>
        <Icon
          src={'/img/assets/clipboard_dark.svg'}
          className={`!w-[15px] !h-[15px] !max-w-[15px] !max-h-[15px] !min-w-[15px] !min-h-[15px]
              cursor-pointer`}
          onClick={copyTokenDetails}
        />
        <div className={'inline-flex ml-auto gap-4'}>
          <SocialIcon socialLink={'https://twitter.com/'} src={`/img/assets/x_${mode}.svg`} />
          <SocialIcon socialLink={'https://twitter.com/'} src={`/img/assets/token_redirect_${mode}.svg`} />
          <SocialIcon socialLink={'https://twitter.com/'} src={`/img/assets/embedded_post_${mode}.svg`} />
          <SocialIcon socialLink={'https://twitter.com/'} src={`/img/assets/website_${mode}.svg`} />
        </div>
      </div>
      <div className={`inline-flex gap-4 justify-between flex-wrap`}>
        <div className={'w-[50px] h-[50px] p-1.25 relative'}>
          <CircularProgress progress={progressSim} />
          <Icon
            src={img}
            className={cn(
              '!w-[40px] !h-[40px] !min-w-[40px] !min-h-[40px] !max-w-[40px] !max-h-[40px] !rounded-full'
            )}
          />
        </div>
        <div className={`flex flex-col gap-2 w-max`}>
          <TokenFeedStats marketCap={numberFormatter(2000)} volume={numberFormatter(2000)} />
          <div className={`inline-flex gap-2`}>
            <IconWithInfo src={'/img/assets/clock_dark.svg'} data={token.age} />
            <IconWithInfo src={'/img/assets/holders_dark.svg'} data={numberFormatter(token.holders)} />
            <IconWithInfo src={'/img/assets/top_holders_dark.svg'} data={token.topHolders} />
          </div>
        </div>
        <div className={`flex gap-2 items-center ml-auto`}>
          <Button
            variant={'secondary'}
            colorScheme={'secondaryGradient'}
            size={'md'}
            className={`px-2.5 py-[5px] w-[56px] h-[35px]
                   from-brand-secondaryGradient-primary to-brand-secondaryGradient-secondary`}
          >
            <Icon src={`/img/assets/lightning.svg`} size={'sm'} />
          </Button>
          {token.migrated &&
            <Button
              colorScheme={'secondaryGradient'}
              variant={'outline'}
              size={'md'}
              className={`px-2.5 py-[5px] w-[56px]  h-[35px]`}
              onClick={handleLp}
            >
              LP
            </Button>
          }
        </div>
      </div>
    </div>
  )
}

export default TokenFeedCard
