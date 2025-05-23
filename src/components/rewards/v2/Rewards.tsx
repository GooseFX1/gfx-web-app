import React from 'react'
import RewardsLeftSidePanel from './leftPanel/RewardsLeftSidePanel'
import RewardsRightSidePanel from './rightPanel/RewardsRightSidePanel'
import { useQuery } from '@tanstack/react-query'

function Rewards(): JSX.Element {
  const apyQuery = useQuery({
    queryKey: ['stake-apy'],
    queryFn: async () => {
      const response = await fetch('https://api-services.goosefx.io/gofx-stake/getApy')
      const data = await response.json()
      return Number(data.data)
    },
    staleTime: 60000,
    placeholderData: 0.00
  })

  return (
    <>
      <RewardsLeftSidePanel />
      <RewardsRightSidePanel apy={apyQuery.data} />
    </>
  )
}

export default Rewards
