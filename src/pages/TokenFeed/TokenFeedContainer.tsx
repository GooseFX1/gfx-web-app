import React, { FC, ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import TokenFeedCard from '@/pages/TokenFeed/TokenFeedCard'

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
  <div className={`flex flex-col border-b-1 border-solid border-b-border-lightmode-secondary 
  dark:border-b-border-darkmode-secondary gap-2 pb-2`}>
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
          className={`mr-auto underline-offset-8 decoration-text-lightmode-primary
           dark:decoration-text-darkmode-primary`}
                        variant={'dotted'}>
          <h3 className={`dark:text-text-darkmode-primary text-text-lightmode-primary`}>{title}</h3>
        </TooltipTrigger>
        <TooltipContent className={``}>{tooltip}</TooltipContent>
      </Tooltip>
      {settings}
    </div>
    <p className={`text-b3 font-semibold dark:text-text-darkmode-secondary`}>{description}</p>
  </TokenFeedContainerHeader>
)
export const TokenFeedContentContainer: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => (
  <div className={`flex flex-col gap-4 py-4`}>{children}</div>
)

export const TokenFeedTokensContainer: FC<{ tokens: TokenFeedToken[] }> = ({ tokens }) => (
  <TokenFeedContentContainer>
    {tokens.length > 0 ? (
      tokens.map((token) => <TokenFeedCard key={token.address} token={token} />)
    ) : (
      <h3 className={`text-center`}>No Tokens Found</h3>
    )}
  </TokenFeedContentContainer>
)

function TokenFeedContainer({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div
      className={`flex flex-col p-4 max-w-[450px] border-1 border-solid dark:border-border-darkmode-secondary
    rounded-[16px] border-border-lightmode-secondary
    `}
    >
      {children}
    </div>
  )
}

export default TokenFeedContainer
