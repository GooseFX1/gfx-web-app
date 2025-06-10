import React, { FC, ReactNode } from 'react'
import { cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import TokenFeedCard from '@/pages/TokenFeed/TokenFeedCard'
import { H3 } from '@/components/text/TextComponents'
import { UserTokenFeedFilterConfig } from '@/types/app_params'

export type TokenFeedToken = {
  address: string
  tickerSymbol: string
  name: string
  age: string
  topHolders: string
  holders: number
  migrated: boolean
  src?: string
}

type TokenFeedContainerProps = {
  tokens: TokenFeedToken[]
  title: ReactNode
  tooltip: ReactNode
  description: ReactNode
  settings: ReactNode
}

export const TokenFeedContainerHeader: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => (
  <div
    className={`flex flex-col border-b-1 border-solid border-b-border-lightmode-secondary 
  dark:border-b-border-darkmode-secondary gap-2 pb-2`}
  >
    {children}
  </div>
)
export const TokenFeedContainerHeaderWithTitle: FC<Partial<TokenFeedContainerProps>> = ({
  title,
  description,
  tooltip,
  settings
}) => (
  <TokenFeedContainerHeader>
    <div className={`inline-flex gap-4`}>
      <Tooltip>
        <TooltipTrigger
          disabled={!tooltip}
          className={`mr-auto underline-offset-8 decoration-text-lightmode-primary
           dark:decoration-text-darkmode-primary`}
          variant={'dotted'}
        >
          <H3>{title}</H3>
        </TooltipTrigger>
        <TooltipContent className={``}>{tooltip}</TooltipContent>
      </Tooltip>
      {settings}
    </div>
    <p className={`text-b3 font-semibold dark:text-text-darkmode-secondary`}>{description}</p>
  </TokenFeedContainerHeader>
)
export const TokenFeedContentContainer: FC<{ children: ReactNode | ReactNode[]; className?: string }> = ({
  children,
  className
}) => <div className={cn(`flex flex-1 flex-col gap-4 pt-4 overflow-scroll`, className)}>{children}</div>

export const TokenFeedTokensContainer: FC<{
  tokens: TokenFeedToken[]
  currentFilters: UserTokenFeedFilterConfig
}> = ({ tokens, currentFilters }) => (
  <TokenFeedContentContainer>
    {tokens.length > 0 ? (
      tokens.map((token) => <TokenFeedCard key={token.address} token={token} currentFilters={currentFilters} />)
    ) : (
      <H3 className={`text-center`}>No Tokens Found</H3>
    )}
  </TokenFeedContentContainer>
)

function TokenFeedContainer({ children, className }: { children: ReactNode | ReactNode[]; className?: string }) {
  return (
    <div
      className={cn(
        `flex flex-col p-4 w-full max-w-[450px] border-1 border-solid dark:border-border-darkmode-secondary
    rounded-[16px] border-border-lightmode-secondary h-[724px] overflow-hidden
    `,
        className
      )}
    >
      {children}
    </div>
  )
}

export default TokenFeedContainer
