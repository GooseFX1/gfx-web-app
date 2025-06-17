import useWebSocket from '@/hooks/useWebSocket'
import { TokenFeedToken } from '@/pages/TokenFeed/TokenFeedContainer'
import { useState } from 'react'
type TokenStreamEvent = {
  tokens: TokenFeedToken[]
}
function useTokenFeedStream(url: string) {
  const [tokens, setTokens] = useState<TokenFeedToken[]>([])

  const handleTokenDataEvent = (event: TokenStreamEvent) => {
    if (!event.tokens || event.tokens.length === 0) {
      console.warn('No tokens received in the event')
      return
    }
    setTokens(tokens)
  }
  useWebSocket<TokenStreamEvent>({
    url,
    callback: handleTokenDataEvent
  })
  return {
    tokens
  }
}

export default useTokenFeedStream